# Generated by Django 5.1.6 on 2025-03-27 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0016_foodtype_relevant_regulations'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='foodtype',
            name='calories',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='carbohydrates',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='cholesterols',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='fats',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='natriums',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='proteins',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='saturated_fats',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='sugars',
        ),
        migrations.RemoveField(
            model_name='foodtype',
            name='trans_fats',
        ),
        migrations.AddField(
            model_name='foodtype',
            name='nutritions',
            field=models.CharField(blank=True, max_length=1, null=True, verbose_name='영양성분'),
        ),
    ]
