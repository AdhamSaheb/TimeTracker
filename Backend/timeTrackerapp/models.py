import datetime

from django.contrib.auth import authenticate
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, Model
from django_mysql.models import ListCharField
# Create your models here.
from timeTrackerapp.Managers import CustomUserManager


# Custom user Model using the custom user manager
class MyUser(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    email = models.EmailField(('email address'), unique=True)
    roles = models.CharField(choices={('manager', 'M'), ('superadmin', 'S'), ('employee', 'E')}, max_length=20)
    profilePic = models.URLField(default='', null=True)
    objects = CustomUserManager()

    def __str__(self):
        return str(self.email)


class Schedule(models.Model):
    workDays = ListCharField(
        base_field=CharField(max_length=20),
        size=7,
        max_length=(7 * 20 + 7)  # character nominals, plus commas
    )
    first_hour = models.TimeField(default=datetime.time(8, 00, 00), null=True)
    last_hour = models.TimeField(default=datetime.time(17, 00, 00), null=True)


# Project Entity
class Project(models.Model):
    name = models.CharField(max_length=100)
    module = ListCharField(
        base_field=CharField(max_length=10, choices={('Frontend', 'F'), ('Backend', 'B'), ('Mobile', 'M')}),
        size=10,
        max_length=(10 * 10 + 10),  # character nominals, plus commas

    )
    # in hours
    estimationTime = models.PositiveIntegerField()
    manager = models.ForeignKey(MyUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    @property
    def tasks(self):
        return self.task_set.all().order_by('-id')


# Task Entity
class Task(models.Model):
    name = CharField(max_length=50)
    employee = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    # in hours
    time = models.PositiveIntegerField()
    active = models.BooleanField(default=False)
    is_finished = models.BooleanField(default=False)

    @property
    def get_time(self):
        total_hours = 0.0
        total_minutes = 0.0
        for log in self.timelogs.all():
            if log.endTime:
                total_hours += log.endTime.hour - log.startTime.hour
                if log.endTime.minute < log.startTime.minute:
                    total_hours -= 1
                    total_minutes += (60 - abs(log.endTime.minute - log.startTime.minute))
                else :
                    total_minutes += log.endTime.minute - log.startTime.minute
                total_minutes /= 60
        return total_minutes + total_hours

    def __str__(self):
        return self.name


# slot of work for each task
class TimeLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='timelogs')
    startTime = models.DateTimeField()
    endTime = models.DateTimeField(null=True)

    def __str__(self):
        return self.task.name + "  :" + str(self.task.employee.first_name) + " - " + str(self.task.project.name)


class Module(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name
