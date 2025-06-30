// 명언 데이터베이스 (JSON 파일에서 로드됨)
let quotes = [];

// DOM 요소 선택
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote-btn");
const quoteCard = document.querySelector(".quote-card");

// 현재 명언 인덱스 추적 (중복 방지)
let currentQuoteIndex = -1;

// JSON 파일에서 명언 데이터 로드
async function loadQuotes() {
  try {
    const response = await fetch("quotes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    quotes = await response.json();
    console.log(`${quotes.length}개의 명언을 성공적으로 로드했습니다.`);
  } catch (error) {
    console.error("명언 데이터를 불러오는 중 오류가 발생했습니다:", error);

    // 백업 명언 데이터 (JSON 로드 실패 시 사용)
    quotes = [
      {
        quote: "성공은 최선을 다한 결과이지, 반드시 승리하는 것이 아니다.",
        author: "존 우든",
      },
      {
        quote: "천 마디 말보다 하나의 행동이 더 가치 있다.",
        author: "마하트마 간디",
      },
      {
        quote: "실패는 성공으로 가는 가장 빠른 길이다.",
        author: "코코 샤넬",
      },
    ];

    // 사용자에게 알림
    setTimeout(() => {
      alert(
        "명언 파일을 불러오는 중 문제가 발생했습니다.\n백업 명언을 사용합니다."
      );
    }, 1000);
  }
}

// 랜덤 명언 선택 함수
function getRandomQuote() {
  if (quotes.length === 0) {
    return {
      quote: "명언을 불러오는 중입니다...",
      author: "시스템",
    };
  }

  let randomIndex;

  // 같은 명언이 연속으로 나오지 않도록 처리
  do {
    randomIndex = Math.floor(Math.random() * quotes.length);
  } while (randomIndex === currentQuoteIndex && quotes.length > 1);

  currentQuoteIndex = randomIndex;
  return quotes[randomIndex];
}

// 명언 표시 함수
function displayQuote() {
  const quote = getRandomQuote();

  // 페이드 아웃 효과
  quoteCard.style.opacity = "0";
  quoteCard.style.transform = "translateY(20px)";

  setTimeout(() => {
    // 내용 업데이트 (JSON 구조에 맞게 수정)
    quoteText.textContent = quote.quote;
    quoteAuthor.textContent = `- ${quote.author}`;

    // 페이드 인 효과
    quoteCard.style.opacity = "1";
    quoteCard.style.transform = "translateY(0)";
    quoteCard.classList.add("fade-in");

    // 애니메이션 클래스 제거 (재사용을 위해)
    setTimeout(() => {
      quoteCard.classList.remove("fade-in");
    }, 600);
  }, 300);
}

// 버튼 클릭 이벤트 처리
function handleNewQuoteClick() {
  if (quotes.length === 0) {
    alert("명언 데이터가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  // 버튼 일시적 비활성화 (연속 클릭 방지)
  newQuoteBtn.disabled = true;
  newQuoteBtn.textContent = "새 명언 준비 중...";

  // 명언 변경
  displayQuote();

  // 버튼 재활성화
  setTimeout(() => {
    newQuoteBtn.disabled = false;
    newQuoteBtn.textContent = "새 명언 보기";
  }, 800);
}

// 키보드 이벤트 처리 (스페이스바로도 새 명언 가능)
function handleKeyPress(event) {
  if (event.code === "Space" && !newQuoteBtn.disabled && quotes.length > 0) {
    event.preventDefault();
    handleNewQuoteClick();
  }
}

// 페이지 로드 시 초기화
async function init() {
  // CSS 트랜지션 초기 설정
  quoteCard.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  // 로딩 메시지 표시
  quoteText.textContent = "명언을 불러오는 중...";
  quoteAuthor.textContent = "- 잠시만 기다려주세요";

  // 명언 데이터 로드
  await loadQuotes();

  // 초기 명언 표시
  displayQuote();

  // 이벤트 리스너 등록
  newQuoteBtn.addEventListener("click", handleNewQuoteClick);
  document.addEventListener("keydown", handleKeyPress);

  // 포커스 관리
  newQuoteBtn.addEventListener("blur", () => {
    setTimeout(() => newQuoteBtn.blur(), 100);
  });
}

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", init);

// 브라우저 뒤로 가기/앞으로 가기 시에도 새로운 명언 표시
window.addEventListener("pageshow", (event) => {
  if (event.persisted && quotes.length > 0) {
    displayQuote();
  }
});
