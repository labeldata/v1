# Generated by Django 5.1.4 on 2025-01-21 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0014_alter_fooditem_frmlc_mtrqlt_alter_fooditem_usages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='usages',
            field=models.TextField(blank=True, max_length=4000, null=True, verbose_name='용법'),
        ),
    ]
