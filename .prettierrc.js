/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      options: { parser: 'babel-ts' },
    },
  ],
  // 화살표 함수 식 매개변수 () 생략 여부 (ex: (a) => a)
  arrowParens: 'always',
  // 닫는 괄호(>) 위치 설정
  // ex: <div
  //       id="unique-id"
  //       class="container"
  //     >
  htmlWhitespaceSensitivity: 'css',
  bracketSameLine: false,
  // 객체 표기 괄호 사이 공백 추가 여부 (ex: { foo: bar })
  bracketSpacing: true,
  // 행폭 설정 (줄 길이가 설정 값보다 길어지면 자동 개행)
  printWidth: 80,
  // 산문 래핑 설정
  proseWrap: 'preserve',
  // 객체 속성 key 값에 인용 부호 사용 여부 (ex: { 'key': 'xkieo-xxxx' })
  quoteProps: 'as-needed',
  // 세미콜론(;) 사용 여부
  semi: true,
  // 싱글 인용 부호(') 사용 여부
  singleQuote: true,
  // 탭 너비 설정
  tabWidth: 2,
  // 객체 마지막 속성 선언 뒷 부분에 콤마 추가 여부
  trailingComma: 'none',
  // 탭 사용 여부
  useTabs: false,
  // 플러그인 추가
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
