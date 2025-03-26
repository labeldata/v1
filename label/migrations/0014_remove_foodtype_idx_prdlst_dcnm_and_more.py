# Generated by Django 5.1.6 on 2025-03-26 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0013_remove_mylabel_food_type_and_more'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='foodtype',
            name='idx_prdlst_dcnm',
        ),
        migrations.RenameField(
            model_name='foodtype',
            old_name='prdlst_dcnm',
            new_name='food_type',
        ),
        migrations.AddIndex(
            model_name='foodtype',
            index=models.Index(fields=['food_type'], name='idx_food_type'),
        ),
    ]
