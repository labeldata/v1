# Generated by Django 5.1.4 on 2025-01-21 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0016_auto_20250121_2159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='pog_daycnt',
            field=models.CharField(blank=True, default='기본소비기한', max_length=200, null=True, verbose_name='소비기한'),
        ),
    ]
