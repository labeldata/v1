# Generated by Django 5.1.6 on 2025-03-31 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0021_foodtype_prdlst_dcnm'),
    ]

    operations = [
        migrations.AddField(
            model_name='foodtype',
            name='country_of_origin',
            field=models.CharField(blank=True, max_length=1, null=True, verbose_name='원산지'),
        ),
    ]
