# Generated by Django 3.2.3 on 2021-05-18 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Company', '0014_auto_20210518_0952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='PostDate',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='StartDate',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
