from rest_framework import serializers
from timeTrackerapp.Serializers.Authentication.Serializers import UserSerializer
from timeTrackerapp.models import Project, Task, TimeLog, MyUser,Module
from datetime import datetime




#Time log representation Serializer
class TimeLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeLog
        fields = ['startTime','endTime','task','id']
        extra_kwargs = {
            'endTime': {'required': 'True'},
        }
        depth = 2 # im not sure if it should be 2 or 1


class CreatTimeLogSerializer(serializers.ModelSerializer):
    # task = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all())
    class Meta:
        model = TimeLog
        fields = ['startTime','endTime','task','id']
        extra_kwargs = {
            'starTime':  {'required' : True},
            'endTime': {'required': True},
            'task': {'required': True},
        }





#To be able to create with only pks of foreign keys
class CreateTaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    timelogs = TimeLogSerializer(many=True,read_only=True)
    class Meta:
        model = Task
        fields = '__all__'




#Serializer for tasks
class TaskSerializer(serializers.ModelSerializer):

    employee = UserSerializer()
    timelogs = TimeLogSerializer(many=True ,read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    total = serializers.FloatField(source='get_time',read_only=True,)
    class Meta:
        model = Task
        fields = ['name','time','employee','project','timelogs','id','active','total','is_finished']


#Serializer for updating tasks
class UpdateTaskSerializer(serializers.ModelSerializer):

    employee = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
    timelogs = TimeLogSerializer(many=True ,read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    class Meta:
        model = Task
        fields = ['name','time','employee','project','timelogs','id','active']


# this is the serializer used in automatic time log calculation serializer
class StartTimeLogSerializer(serializers.ModelSerializer):

    task_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = TimeLog
        fields = '__all__'
        extra_kwargs = {
            'task_id': {'required': True},
            'startTime': {'required': False},
            'endTime': {'required': False},
        }
        depth = 2

    def create(self, validated_data):

        temptask = Task.objects.get(id=validated_data['task_id'])
        instance = TimeLog.objects.create(task = temptask, startTime=datetime.now().isoformat())
        #set the task to active since a timelog is created on it
        instance.task.active = True
        instance.task.save()
        return instance

#this serializer will be used to stop a time log
class StopTimeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeLog
        fields = '__all__'
        extra_kwargs = {
            'startTime': {'read_only': 'True'},
            'task': {'read_only': 'True'},
            'id': {'read_only': 'True'},
            # 'endTime' : {'required' : 'True'}
        }
        depth = 1
    def update(self, instance, validated_data):

        setattr(instance, 'endTime', datetime.now().isoformat())
        instance.task.active = False
        instance.task.save()
        instance.save()
        return instance



class ProjectSerializer(serializers.ModelSerializer):

    def isManager(manager):
        user = MyUser.objects.get(pk = manager.id)
        if 'manager' not in user.roles:
            raise serializers.ValidationError( 'Manager has to have a role of manager ')

    # manager = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all(),validators=[isManager])
    class Meta:
        model = Project
        fields = '__all__'


# A different serializer for viewing the projects in order to show all of the manager attributes
class ProjectListSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    module = serializers.ListField(
        child=serializers.CharField()
    )
    estimationTime = serializers.IntegerField()
    manager = UserSerializer()
    task_set = TaskSerializer(source="tasks", many=True , read_only=True)
    id = serializers.IntegerField()


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'



class FinishTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id']

    def update(self, instance, validated_data):
        instance.is_finished = True
        instance.save()
        return instance
