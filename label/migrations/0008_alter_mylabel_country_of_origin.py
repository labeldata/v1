# Generated by Django 5.1.4 on 2025-02-13 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0007_alter_mylabel_country_of_origin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mylabel',
            name='country_of_origin',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='원산지'),
        ),
    ]
