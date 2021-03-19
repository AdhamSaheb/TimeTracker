# Generated by Django 3.0.8 on 2020-07-12 13:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('timeTrackerapp', '0005_auto_20200712_0942'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timelog',
            name='endTime',
            field=models.DateTimeField(blank=True),
        ),
        migrations.AlterField(
            model_name='timelog',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='timelogs', to='timeTrackerapp.Task'),
        ),
    ]