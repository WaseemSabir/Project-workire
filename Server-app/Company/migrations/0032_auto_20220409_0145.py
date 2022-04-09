# Generated by Django 3.2.3 on 2022-04-09 01:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Company', '0031_auto_20220409_0026'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='seo_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='seo_keywords',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='seo_title',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='seo_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='seo_keywords',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='seo_title',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='countries',
            name='seo_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='countries',
            name='seo_keywords',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='countries',
            name='seo_title',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='designation',
            name='seo_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='designation',
            name='seo_keywords',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='designation',
            name='seo_title',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='trendingsearch',
            name='seo_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='trendingsearch',
            name='seo_keywords',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='trendingsearch',
            name='seo_title',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
