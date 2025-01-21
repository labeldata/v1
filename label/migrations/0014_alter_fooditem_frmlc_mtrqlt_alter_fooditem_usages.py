# Generated by Django 5.1.4 on 2025-01-21 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0013_alter_fooditem_frmlc_mtrqlt_alter_fooditem_usages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='frmlc_mtrqlt',
            field=models.TextField(blank=True, max_length=300, null=True, verbose_name='포장재질'),
        ),
        migrations.AlterField(
            model_name='fooditem',
            name='usages',
            field=models.TextField(blank=True, max_length=2000, null=True, verbose_name='용법'),
        ),
    ]