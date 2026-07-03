# 이미지 폴더 구조 (실제 업로드 기준)

## 폴더 구성

```
images/
├── favicon.png          ← 파비콘
├── og-image.jpg         ← SNS·카카오 미리보기
├── hero.jpg             ← 메인·지역 페이지 히어로 배경
├── yupum.jpg            ← Schema 유품정리
├── godoksa.jpg          ← Schema 고독사청소
├── special.jpg          ← Schema 특수청소
├── trash-house.jpg      ← Schema 쓰레기집청소
├── waste.jpg            ← Schema 폐기물처리
├── main/                ← 메인·지역 페이지 작업 3단 사진
│   ├── before-01.jpg ~ before-30.jpg
│   ├── process-01.jpg ~ process-25.jpg
│   └── after-01.jpg ~ after-30.jpg
└── cases/               ← 작업후기 전·후 사진 (200장)
    ├── before-001.jpg ~ before-050.jpg   (유품)
    ├── after-001.jpg ~ after-050.jpg
    ├── waste-before-051.jpg ~ waste-before-100.jpg  (폐기물)
    └── waste-after-051.jpg ~ waste-after-100.jpg
```

> `cades` 폴더는 오타로 생긴 폴더였으며, 내용은 `cases`로 이동 완료했습니다.  
> `regions/`, `schema/` 폴더는 사용하지 않습니다.

---

## main — 메인·지역 페이지

각 페이지는 **같은 번호**의 before / process / after 3장을 짝으로 사용합니다.

| 번호 | 페이지 |
|------|--------|
| 01 | 메인 |
| 02 | 분당구 |
| 03 | 판교동 |
| 04 | 정자동 |
| 05 | 서현동 |
| 06 | 수내동 |
| 07 | 야탑동 |
| 08 | 분당동 |
| 09 | 수정구 |
| 10 | 위례동 |
| 11 | 신흥동 |
| 12 | 중원구 |
| 13 | 성남동 |

파일명: `before-02.jpg`, `process-02.jpg`, `after-02.jpg` (두 자리 번호)

---

## cases — 작업후기 (전·후 2장)

| 범위 | 파일명 | 서비스 |
|------|--------|--------|
| 001~050 | `before-001.jpg` + `after-001.jpg` | 유품정리·고독사·특수청소 |
| 051~100 | `waste-before-051.jpg` + `waste-after-051.jpg` | 폐기물·쓰레기집·빈집 등 |

작업후기 페이지에서 서비스 유형에 맞는 범위에서 **랜덤** 표시됩니다.

---

## 현재 업로드 상태

- [x] `images/favicon.png`
- [x] `images/og-image.jpg`
- [x] `images/hero.jpg`
- [x] Schema 5장 (`yupum`, `godoksa`, `special`, `trash-house`, `waste`)
- [x] `images/main/` before·after 01~30, process 01~25
- [x] `images/cases/` 200장 (cades → cases 이동 완료)

추가 작업 불필요. 배포만 하시면 됩니다.
