from django.contrib import admin

# Register your models here.
from timeTrackerapp.models import MyUser,Schedule,Task,TimeLog,Project,Module

@admin.register(MyUser)
class CustomUserAdmin(admin.ModelAdmin):
    ordering = ('id',)
    fields = ('username', 'password', 'email','roles', 'is_superuser','is_active','profilePic',"first_name" ,"last_name",'id')
    readonly_fields = ('id',)


admin.site.register(Schedule)
admin.site.register(Task)
admin.site.register(TimeLog)
admin.site.register(Project)
admin.site.register(Module)



