# Generated by Django 5.1.4 on 2025-02-12 01:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0004_alter_countrylist_country_code_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mylabel',
            name='country_of_origin',
            field=models.CharField(blank=True, max_length=2, null=True, verbose_name='원산지'),
        ),
    ]
