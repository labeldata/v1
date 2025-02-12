# Welcome to your organization's demo respository
This code repository (or "repo") is designed to demonstrate the best GitHub has to offer with the least amount of noise.

The repo includes an `index.html` file (so it can render a web page), two GitHub Actions workflows, and a CSS stylesheet dependency.

project/
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
├── user_management/
│   ├── views.py
│   ├── urls.py
│   ├── templates/
│       ├── user_management/signup.html
│       ├── user_management/login.html
├── action/
│   ├── admin.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
├── label/
│   ├── admin.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── templates/
│       ├── label/post_list.html
│       ├── label/food_item_detail.html
├── main/
│   ├── views.py
│   ├── urls.py
│   ├── templates/
│       ├── main/home.html
└── common/
    ├── models.py
    ├── utils.py


templates/
├── base.html               # 프로젝트 전역에서 사용하는 기본 템플릿
├── includes/               # 공통적으로 포함되는 템플릿 요소
│   ├── messages.html
│   ├── navbar.html
│   ├── pagination.html
├── main/                   # main 앱 관련 템플릿
│   ├── home.html
│   ├── food_item_detail.html
├── action/                 # action 앱 관련 템플릿
│   ├── action_confirm_delete.html
│   ├── action_form.html
│   ├── action_list.html
│   ├── action_detail.html
├── user_management/        # user_management 앱 관련 템플릿
│   ├── login.html
│   ├── signup.html
├── label/                  # label 앱 관련 템플릿
│   ├── food_item_list.html
│   ├── post_detail.html
│   ├── post_form.html
│   ├── post_list.html
├── admin/                  # 관리자 페이지 관련 템플릿
│   ├── change_list.html

git status # 현재 상태 확인
git add 파일명 or . # 파일 추가
git commit -m "커밋 메시지" #커밋 생성
git push origin main # 원격 저장소 푸시


행정처분 관련

 
새올 전자민원창구 - 서울만은 아니고 전국에 많은 듯

<a href="javascript:fncViewDtl('SNTX',
						'5670123',
						'2025',
						'13',
						'CMM')">일반음식점</a>

<a href="javascript:fncViewDtl('CDFX',
						'5670123',
						'2025',
						'100001',
						'CMM')">노래연습장업</a>
첫번째 인수?
두번째 인수 - 지역코드? 서울의 경우 구마다 다른 듯
세번째, 네번째 인수 - 연도, 행정처분번호



행정처분 모델 - (지역명 or 지역코드, 행정처분번호)

처분확정일자	varchar(10)		not null		yyyy-mm-dd
업종명		varchar(80)		not null
업소명		varchar(200)	not null
소재지_도로명	varchar(300)
소재지_지번명	varchar(300)
처분사항		varchar(100)	not null

행정처분 상세
행정처분번호	varchar(20)		not null
인허가번호		varchar(20)		not null
대표자명		varchar(50)
처분기간		varchar(30)
안내사항		varchar(100)

위반내용		longtext					\로 구분해서 다 한 곳에 (위반내용(0)차, 내용, 위반내용(0)차, 내용)

처리부서		varchar(20)
담당자		varchar(20)
전화번호		varchar(15)
이메일		varchar(40)


작업 계획(1.19)
○ 1/25 오전 9시 ~30분 리뷰

1. 메인페이지 : 추후 확정
2. 제품 목록
   1) 리스트가 조회 안됨 -> fooditem 모델 수정(항목 추가 : 제품명, 업소명, 유형, 유통/소비기한, 최종수정일자 등) 및 리스트 연결
   2) 하단 페이지번호 조회 기준 변경 -> 10개씩, 현재 위치 표시 등
   3) 제품 상세보기 페이지 -> 추가 -> 내 표시사항 작성 기능으로 연결
3. 표시사항 등록
   1) label model 필요정보 상세히 설계
4. 행정처분 크롤링 기능 상세화 - 서초구
   1) 조회화면 생성, 검색 기능 설계(메인 화면)
 2) 지자체url 등록, 크롤링 항목을 개별 관리하는 메뉴


작업 계획(1.25)

1. 제품 정보 내 원재료정보 추가 (fooditem + 원재료정보) 모델링
2. 제품 상세페이지(팝업) 항목 수정, 라벨 생성 페이지 연결
3. 라벨 모델링, 내라벨 리스트, 정보 입력, 상세 보기
4. 행정처분 크롤링 및 DB 저장까지 구현

#나의 원재료를 어떻게 구현할 것인가? CRUD

[User]
    | 1:N
[MyProduct] ---> [Label] ---> [LabelOrder]
                       | 1:N
                [MyIngredients] ---> [FoodItem] (데이터 원천)
                       |
                 [FrequentlyUsedText] (자주 사용하는 문구)


[MyProduct]   --- (1:N) ---> [Label]   --- (1:N) ---> [MyIngredients]
                        |
                        |
                        ---> (1:1) [LabelOrder]

				 
목표 : 런칭 상반기(6월), 테스트(5월), 개발(2~4월)

작업방식 : html, models 만 전달하기
#chat gpt 계정 : labeldatagpt@naver.com / vmfhwprxm123!

1. 표시사항 제작
   1) 품목제조정보 API 연동
   2) 내 라벨 저장(fooditem->label) -> 상세페이지 설계(~2/15)
       - 원재료명 모델 및 로직, HTML
       ㄴ 원재료명 수정 or 표로 분할해서 수정하는 경우 "," 개별 원료를 저장해서 입력하게끔 기능 구현(원산지, 알레르기 물질, 함량, 표시명 등)
       ㄴ 표로 입력한 내용을 규칙에 맞게 원재료명을 구성해주는 기능
       ㄴ 함량) 입력하지 않은 경우 순서대로 원재료 표시
       ㄴ 함량 미입력하면 표시 순서는 입력 순으로 적용하되, 사용자 순서 변경할 수 있다.
       ㄴ 다른 사람이 많이 사용한 원재료명 추천
       ㄴ 원재료별 알레르기 물질 여부 체크
      - 자주 사용하는 문구
      - 알레르기 물질 관리
      - 파일 첨부
      - 코멘트 이력
   3) 미리보기 페이지(추후)
   4) 라벨 공유하기~~

2. 행정처분 알리미 (추후 개발)