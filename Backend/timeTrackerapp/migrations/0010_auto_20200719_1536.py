# Generated by Django 3.0.8 on 2020-07-19 15:36

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('timeTrackerapp', '0009_module'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='roles',
            field=models.CharField(choices=[('superadmin', 'S'), ('manager', 'M'), ('employee', 'E')], max_length=20),
        ),
        migrations.AlterField(
            model_name='project',
            name='module',
            field=django_mysql.models.ListCharField(models.CharField(choices=[('Frontend', 'F'), ('Backend', 'B'), ('Mobile', 'M')], max_length=10), max_length=110, size=10),
        ),
    ]
