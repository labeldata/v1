# Generated by Django 5.1.4 on 2025-02-18 22:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0004_myingredient_search_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='labelingredientrelation',
            name='prdlst_nm',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='제품명'),
        ),
    ]
