# Generated by Django 3.2.3 on 2021-08-30 00:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Company', '0025_countries_popular_jobs_in_loc_comma_separeted'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='countries',
            name='popular_jobs_in_loc_comma_separeted',
        ),
        migrations.RemoveField(
            model_name='countries',
            name='salary',
        ),
    ]