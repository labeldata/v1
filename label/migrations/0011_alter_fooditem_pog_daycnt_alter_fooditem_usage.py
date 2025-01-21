# Generated by Django 5.1.4 on 2025-01-21 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0010_alter_fooditem_usage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='pog_daycnt',
            field=models.CharField(default='기본소비기한', max_length=200, verbose_name='소비기한'),
        ),
        migrations.AlterField(
            model_name='fooditem',
            name='usage',
            field=models.CharField(blank=True, max_length=500, null=True, verbose_name='용법'),
        ),
    ]