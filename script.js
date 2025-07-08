
// 1. استخرج اسم الاختبار من عنوان الصفحة أو من باراميتر الـ URL
//    مثلاً: index.html?test=test1
const params = new URLSearchParams(location.search);
const testName = params.get('test') || 'test1';

// 2. حدّد العنصرين اللذين سنحقن فيهما العنوان والمحتوى
const titleEl = document.getElementById('quiz-title');
const containerEl = document.getElementById('quiz-container');
const resultBox = document.getElementById('result-box');
const scoreEl = document.getElementById('score');

// 3. جب ملف الاختبار (HTML Fragment) من المجلد tests/
fetch(`tests/${testName}.html`)
  .then(r => r.text())
  .then(html => {
    // الـ HTML داخل tests/testX.html يجب أن يبدأ بعنوان <h1> وينتهي قبل صندوق النتيجة
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // الحقن
    const h1 = temp.querySelector('h1');
    if (h1) {
      titleEl.textContent = h1.textContent;
      document.title = h1.textContent;
      h1.remove();
    }

    // باقي المحتوى: الأسئلة والتلميحات
    containerEl.innerHTML = temp.innerHTML;

    // أخيراً اشغّل وظيفة التعامل مع الخيارات
    initQuiz();
  });

// 4. دالة تهيئة الأسئلة
function initQuiz() {
  let score = 0, answered = 0;
  const options = containerEl.querySelectorAll('.option');

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const block = opt.parentElement;
      if (block.querySelector('.selected')) return;
      const correct = opt.dataset.correct === 'true';
      if (correct) {
        opt.classList.add('correct');
        score += 2;
      } else {
        opt.classList.add('wrong');
        const hint = block.querySelector('.hint');
        if (hint) hint.style.display = 'block';
      }
      // إظهار الصحيح
      block.querySelectorAll('.option')
           .forEach(o => o.dataset.correct==='true' && o.classList.add('correct'));
      opt.classList.add('selected');
      answered++;
      scoreEl.textContent = score;
      if (answered === containerEl.querySelectorAll('.question-container').length) {
        resultBox.style.display = 'block';
      }
    });
  });
}
