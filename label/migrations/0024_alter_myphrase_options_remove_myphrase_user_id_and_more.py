# Generated by Django 5.1.6 on 2025-04-03 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0023_alter_foodtype_type_check'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='myphrase',
            options={'ordering': ['display_order', '-update_datetime']},
        ),
        migrations.RemoveField(
            model_name='myphrase',
            name='user_id',
        ),
        migrations.AddField(
            model_name='myphrase',
            name='create_datetime',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='생성일시'),
        ),
        migrations.AddField(
            model_name='myphrase',
            name='display_order',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='myphrase',
            name='category_name',
            field=models.CharField(choices=[('cautions', '주의사항'), ('additional', '기타표시사항')], max_length=100, verbose_name='문구 카테고리'),
        ),
        migrations.AlterField(
            model_name='myphrase',
            name='delete_YN',
            field=models.CharField(default='N', max_length=1, verbose_name='삭제 여부'),
        ),
        migrations.AlterField(
            model_name='myphrase',
            name='delete_datetime',
            field=models.CharField(blank=True, default='', help_text='yyyymmdd', max_length=8, verbose_name='삭제일자'),
        ),
        migrations.AlterField(
            model_name='myphrase',
            name='update_datetime',
            field=models.DateTimeField(auto_now=True, verbose_name='수정일시'),
        ),
    ]
