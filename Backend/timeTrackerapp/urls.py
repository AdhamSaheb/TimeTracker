from django.urls import path, include
from timeTrackerapp import views
from timeTrackerapp.api.Views import auth_views,model_views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls import  url

appname= 'timeTrackerapp'


schema_view = get_schema_view(
   openapi.Info(
      title="Time Tracker API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', views.index , name='index'),
    # ---------------------------------------------------------------------------------------------------------
    # auth related urls
    path('api/login', auth_views.Login.as_view() , name='login'),
    path('api/register', auth_views.Register.as_view() , name='register'),
    path('api/users/', auth_views.UserList.as_view() , name='userlist'),
    path('api/users/<int:pk>', auth_views.UpdateDestroyUser.as_view() , name='updateuser'),
    path('api/changepassword', auth_views.ChangePassword.as_view() , name='changepassword'),
    path('api-auth/', include('rest_framework.urls')),

    # ---------------------------------------------------------------------------------------------------------
    #yasg
    url(r'^api/swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # --------------------------------------ß-------------------------------------------------------------------
    #model related urls

    #Projects
    #TODO ADD ID TO TASK INSIDE PROJECT LIST
    path('api/projects/create', model_views.CreateProject.as_view() , name='create_projects'),
    path('api/projects/', model_views.ProjectList.as_view() , name='project_list'),
    path('api/project/<int:pk>', model_views.UpdateDeleteProject.as_view() , name='modify_project'),

    #Tasks
    #TODO ADD TASKS LIST
    path('api/tasks/create', model_views.CreateTask.as_view() , name='create_task'), #Flaw : all managers/admins can create tasks for all projects
    path('api/tasks/<int:pk>/finish', model_views.finish_task.as_view() , name='finish_task'),
    path('api/task/<int:pk>', model_views.UpdateDeleteTask.as_view() , name='modify_task'),


    #TimeLogs
    path('api/timelogs/', model_views.TimeLogList.as_view() , name='timelog_list'),
    path('api/timelogs/create', model_views.CreateTimeLog.as_view() , name='timelog_create'),
    path('api/timelogs/<int:pk>', model_views.UpdateTimeLog.as_view() , name='modify_timelog'),
    path('api/timelogs/start', model_views.StartTimeLog.as_view() , name='start_timelog'),
    path('api/timelogs/<int:pk>/stop', model_views.StopTimeLog.as_view() , name='start_timelog'),
    path('api/modules/', model_views.ModuleList.as_view() , name='modules'),




]

