# Generated by Django 5.1.4 on 2025-01-21 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0007_alter_fooditem_frmlc_mtrqlt'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='usage',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='용법'),
        ),
    ]
