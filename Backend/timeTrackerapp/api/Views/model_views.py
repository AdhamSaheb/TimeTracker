from datetime import datetime
from xmlrpc.client import DateTime

from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from timeTrackerapp.Serializers.Models.Serializers import ProjectSerializer, \
    ProjectListSerializer, \
    CreateTaskSerializer, \
    TaskSerializer, TimeLogSerializer, StartTimeLogSerializer, StopTimeLogSerializer, ModuleSerializer, \
    UpdateTaskSerializer, CreatTimeLogSerializer, FinishTaskSerializer
from timeTrackerapp.models import MyUser, Project, Task, TimeLog, Module
from timeTrackerapp.api.Permission.permissions import IsManagerOrSuperAdmin, IsProjectOwner


# Create projects
# the manager has to pe passed by id to the post request
class CreateProject(mixins.CreateModelMixin
    , generics.GenericAPIView):
    serializer_class = ProjectSerializer
    # only managers and superAdmins can create projects
    permission_classes = [IsManagerOrSuperAdmin]

    # todo : Managers can  create projects for other managers
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UpdateDeleteProject(mixins.UpdateModelMixin,
                          mixins.DestroyModelMixin
    , generics.GenericAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectOwner]  # Flaw, query might fail before validation
    queryset = Project.objects.all()

    def getManager(self):
        project = Project.objects.get(id=self.kwargs['pk'])
        return project.manager.email

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


# api to list projects per manager/all projects
class ProjectList(APIView):
    # permission_classes = [IsManagerOrSuperAdmin]
    def get(self, request, format=None):
        user = MyUser.objects.get(email=request.user.email)
        if ('superadmin' in user.roles):
            projects = Project.objects.all().order_by('-id')
        elif 'manager' in user.roles:
            projects = Project.objects.filter(manager=user).order_by('-id')
        # return all projects the employee is envolved with. note: IDK if its a good practice to do this in server side
        elif 'employee' in user.roles:
            projects = []
            # allProjects = Project.objects.all()
            # for project in allProjects:
            #     for task in project.task_set.all():
            #         if task.employee == user:
            #             projects.append(project)
            #             break
            # or the following :
            tasks = Task.objects.filter(employee=user).order_by('-id')

            for task in tasks:
                projects.append(task.project)
            # to remove duplicates
            projects = set(projects)
        serializer = ProjectListSerializer(projects, many=True)
        return Response(serializer.data)


# api to create tasks
class CreateTask(mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = CreateTaskSerializer
    # only managers and superAdmins can create Tasks
    # permission_classes = [IsManagerOrSuperAdmin]
    #todo : add to the permissions the ability for the employee to add a project for himself

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


# api to delete/update tasks
class UpdateDeleteTask(mixins.DestroyModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
    serializer_class = UpdateTaskSerializer
    permission_classes = [IsProjectOwner]  # Flaw : query might fail before validation
    queryset = Task.objects.all()

    def getManager(self):
        task = Task.objects.get(pk=self.kwargs['pk'])
        project = Project.objects.get(id=task.project.id)
        return project.manager.email

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


# class CreateTimeLog(APIView):
class TimeLogList(mixins.ListModelMixin, generics.GenericAPIView):

    def get(self, request, format=None):
        date = datetime.strptime(request.query_params.get('date'), "%Y-%m-%d")

        logs = TimeLog.objects.filter(task__employee=request.user, startTime__day=date.day).order_by('-id')
        serializer = TimeLogSerializer(logs, many=True)
        return Response(serializer.data)


# this API will be used for manual timelog entry
class CreateTimeLog(mixins.CreateModelMixin, generics.GenericAPIView):
    # todo : check what permissions are needed .
    serializer_class = CreatTimeLogSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


# update timelog entry
class UpdateTimeLog(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    # todo : check what permissions are needed .
    serializer_class = TimeLogSerializer
    queryset = TimeLog.objects.all()

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


# this will be used to create a timelog without setting end time ( when start is clicked )
class StartTimeLog(APIView):
    # permission_classes = (IsTaskOwner, )

    def post(self, request, format=None):
        tasks = Task.objects.filter(employee=request.user)
        for task in tasks:
            for timelog in task.timelogs.filter(endTime=None):
                timelog.endTime = datetime.now().isoformat()
                timelog.task.active = False
                timelog.task.save()
                timelog.save()
        serializer = StartTimeLogSerializer(data=request.data)
        # task = serializer.validated_data["task"]
        # self.check_object_permissions(request, task)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


# set the end time of a time log to now
class StopTimeLog(mixins.UpdateModelMixin, generics.GenericAPIView):
    serializer_class = StopTimeLogSerializer
    queryset = TimeLog.objects.all()

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class ModuleList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

from rest_framework.response import Response
class finish_task(mixins.UpdateModelMixin, generics.GenericAPIView):
    serializer_class = FinishTaskSerializer
    queryset = Task.objects.all()
    def put(self, request, *args, **kwargs):
        return self.update(request,*args,**kwargs)