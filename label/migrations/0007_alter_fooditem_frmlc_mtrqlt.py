# Generated by Django 5.1.4 on 2025-01-21 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0006_alter_fooditem_qlity_mntnc_tmlmt_daycnt'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='frmlc_mtrqlt',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='포장재질'),
        ),
    ]
