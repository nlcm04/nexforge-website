/* ============================================================
   NEXFORGE — app.js  (single behaviour bundle, no build step)
   Progressive enhancement: with JS off the page is fully readable and
   navigable; it loses only the momentum scroll, reveals, word-rise hero,
   pinned pillar sequence and the in-place language swap.
   ============================================================ */
(function () {
  'use strict';
  var docEl = document.documentElement;
  docEl.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- split hero line into word masks: .w > .wi ---- */
  function splitWords(el) {
    var text = el.textContent.trim();
    el.innerHTML = '';
    text.split(/\s+/).forEach(function (word, i) {
      var w = document.createElement('span'); w.className = 'w';
      var wi = document.createElement('span'); wi.className = 'wi';
      wi.textContent = word;
      wi.style.transitionDelay = (i * 55) + 'ms';
      w.appendChild(wi);
      el.appendChild(w);
      el.appendChild(document.createTextNode(' '));
    });
  }
  if (!reduce) document.querySelectorAll('[data-split]').forEach(splitWords);

  /* ---- reveal on load ---- */
  function ready() { docEl.classList.add('ready'); }
  window.addEventListener('load', function () { requestAnimationFrame(ready); });
  setTimeout(ready, 1200);

  /* ---- weighted momentum scroll (Lenis), lazy-loaded ---- */
  if (!reduce) {
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js';
    s.onload = function () {
      if (typeof Lenis === 'undefined') return;
      var lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  }

  /* ---- reveal + clip on scroll (position check) ---- */
  var animated = Array.prototype.slice.call(document.querySelectorAll('.reveal, .clip'));
  if (reduce) {
    animated.forEach(function (el) { el.classList.add('in'); });
  } else {
    var rTick = false;
    function checkReveal() {
      rTick = false;
      var trigger = window.innerHeight * 0.88;
      for (var i = animated.length - 1; i >= 0; i--) {
        if (animated[i].getBoundingClientRect().top < trigger) { animated[i].classList.add('in'); animated.splice(i, 1); }
      }
    }
    function onReveal() { if (!rTick) { rTick = true; requestAnimationFrame(checkReveal); } }
    window.addEventListener('scroll', onReveal, { passive: true });
    window.addEventListener('resize', onReveal);
    window.addEventListener('load', checkReveal);
    checkReveal();
  }

  /* ---- scroll-pinned pillar sequence ---- */
  var section = document.querySelector('[data-pin-section]');
  var pinWrap = document.querySelector('[data-pin]');
  var pillars = Array.prototype.slice.call(document.querySelectorAll('.pillar'));
  var markEl = document.querySelector('[data-mark]');
  var progressEl = document.querySelector('[data-progress]');
  var indexEl = document.querySelector('[data-index]');
  // The scroll-pin only works in the wide two-column layout (lg: >=1024px).
  // Below that the grid collapses to one column, so pin it there would stack
  // "What we do" tightly under "The firm". Fall back to the clean static layout.
  var pinnable = window.innerWidth >= 1024;
  if (section && (reduce || !pinnable)) section.classList.add('no-pin');
  if (!reduce && pinnable && section && pinWrap && pillars.length) {
    var pTick = false;
    function updatePin() {
      pTick = false;
      var total = pinWrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var top = pinWrap.getBoundingClientRect().top;
      var p = Math.min(1, Math.max(0, -top / total));
      var idx = Math.min(pillars.length - 1, Math.floor(p * pillars.length + 0.0001));
      pillars.forEach(function (li, i) { li.classList.toggle('active', i === idx); });
      if (markEl) markEl.style.transform = 'rotate(' + (p * 180).toFixed(1) + 'deg)';
      if (progressEl) progressEl.style.width = (((idx + 1) / pillars.length) * 100) + '%';
      if (indexEl) indexEl.textContent = '0' + (idx + 1);
    }
    function onPin() { if (!pTick) { pTick = true; requestAnimationFrame(updatePin); } }
    window.addEventListener('scroll', onPin, { passive: true });
    window.addEventListener('resize', onPin);
    updatePin();
  }

  /* ---- always-visible nav: background + wordmark appear once past the hero;
          active-section link highlight ---- */
  var nav = document.getElementById('nav');
  var hero = document.getElementById('top');
  if (nav) {
    function navState() { nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7); }
    window.addEventListener('scroll', navState, { passive: true });
    window.addEventListener('resize', navState);
    navState();
  }
  if (nav && 'IntersectionObserver' in window) {
    var links = {};
    document.querySelectorAll('.nav-link').forEach(function (l) { links[l.dataset.nav] = l; });
    ['firm', 'work', 'people', 'contact'].forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            Object.keys(links).forEach(function (k) { links[k].setAttribute('aria-current', String(k === id)); });
          }
        });
      }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' }).observe(sec);
    });
  }

  /* ---- i18n: EN authored · VI transcreated (natural, not literal) ---- */
  var I18N = {
    en: {
      bio_more: 'Read full biography', bio_less: 'Close', scroll: 'Scroll',
      nav_firm: 'The firm', nav_work: 'What we do', nav_people: 'People', nav_contact: 'Contact',
      hero_line: 'We advise, operate and build alongside private Vietnamese companies.',
      hero_place: 'Ho Chi Minh City',
      firm_body: 'Nexforge is a boutique firm located in Ho Chi Minh City. For over ten years we have advised companies on capital, fundraising and partnerships. The mandate often extended into business strategy and execution. Where it is right for both sides we take a position and help run the business. And where something is missing that cannot be bought, we help build it. We work with a handful of selected companies at a time, and we stay for years.',
      firm_scale: 'We have advised companies across consumer, media, healthcare, industrials, real estate and financial services.',
      work_note: 'Three pillars, read as one sequence — each makes the next inevitable.',
      p1_h: 'Advise', p1_b: 'We advise companies on strategy, and then help them allocate capital across the right areas of their business — often raising or restructuring their capital structure to enable its success. Over a decade across different industries has helped us understand companies and the industries they compete in.',
      p2_h: 'Operate', p2_b: 'When appropriate, we take a stake and help operate what we own. This creates accountability and aligns interests, ensuring we are truly on the side of the founder. Advice you are accountable for is a different thing from advice you deliver.',
      p3_h: 'Build', p3_b: 'Where a company needs something that does not exist to buy or borrow, we help build it — taking a share of the value we help create rather than just a fee.',
      le_title1: 'Co-Founder, Nexforge', le_title2: 'Founder & Managing Partner, LM Capital',
      kelly_title1: 'Senior Advisor, Nexforge', kelly_title2: 'Senior Advisor, LM Capital',
      cred_prev: 'Previously', cred_edu: 'Education',
      le_bio: 'Vũ Thành Lê is Co-Founder of Nexforge and Founder & Managing Partner of LM Capital, with more than eighteen years across investment, corporate finance, M&A, capital raising, real estate, insurance, financial services and business transformation. Over the past decade he has built LM Capital into an independent strategic and financial advisory firm focused on Vietnam — advising entrepreneurs, corporations, family-owned businesses and international investors across many sectors.',
      le_bio2: 'Nexforge marks the next chapter of that journey — expanding from strategic advisory into a model that advises, invests in and builds alongside Vietnamese businesses. Here he works with founder-led and private companies to strengthen governance, capital structure, reporting, management systems and long-term growth readiness. Prior to LM Capital he held senior roles at HSBC Vietnam, PVI Holdings, PVI Sun Life and SonKim Land. He is an alumnus of the Stanford Graduate School of Business – Stanford Executive Program and holds a BSc in Business Administration (Finance) from the University of Tulsa.',
      kelly_bio: "Kelly advises Nexforge on technology and operations. He is Chief Executive Officer of VNG Corporation, Vietnam's first technology unicorn, which he joined in 2019 to build VNGGames as CEO before being appointed Group CEO in 2025. VNG spans games and interactive entertainment, AI infrastructure through GreenNode, communications through Zalo and fintech through ZaloPay.",
      kelly_bio2: 'Before VNG he was Chief Financial Officer of KIDO Group (formerly Kinh Do Group) and Managing Director of Corporate Advisory at Ho Chi Minh City Securities (HSC), working across M&A and capital markets for Vietnamese corporates.',
      contact_kicker: 'Write to us', contact_place: 'Ho Chi Minh City, Vietnam',
      contact_phone: 'Phone', contact_fax: 'Fax',
      reg_entity: 'LM Capital Company Limited (Công ty TNHH LM Capital)',
      reg_no: 'Enterprise registration no. 0314707382 · Established 1 November 2017',
      reg_addr: '58 Đồng Khởi, Sài Gòn Ward, Ho Chi Minh City, Vietnam',
    },
    vi: {
      bio_more: 'Đọc tiểu sử đầy đủ', bio_less: 'Thu gọn', scroll: 'Cuộn xuống',
      nav_firm: 'Về chúng tôi', nav_work: 'Hoạt động', nav_people: 'Đội ngũ', nav_contact: 'Liên hệ',
      hero_line: 'Chúng tôi tư vấn, vận hành và kiến tạo cùng các doanh nghiệp tư nhân Việt Nam.',
      hero_place: 'Thành phố Hồ Chí Minh',
      firm_body: 'Nexforge là một công ty tinh gọn tại Thành phố Hồ Chí Minh. Hơn mười năm qua, chúng tôi tư vấn cho doanh nghiệp về vốn, huy động vốn và quan hệ đối tác — và thường đồng hành sâu hơn vào chiến lược cũng như triển khai. Khi thực sự phù hợp cho cả hai bên, chúng tôi tham gia sở hữu và cùng điều hành doanh nghiệp. Và khi thiếu một thứ không thể mua được, chúng tôi cùng xây dựng nên nó. Mỗi thời điểm, chúng tôi chỉ đồng hành cùng một số ít doanh nghiệp chọn lọc — và gắn bó trong nhiều năm.',
      firm_scale: 'Chúng tôi đã tư vấn cho các doanh nghiệp trong nhiều lĩnh vực: tiêu dùng, truyền thông, y tế, công nghiệp, bất động sản và dịch vụ tài chính.',
      work_note: 'Ba trụ cột, đọc như một mạch liền — điều trước mở đường cho điều sau.',
      p1_h: 'Tư vấn', p1_b: 'Chúng tôi tư vấn cho doanh nghiệp về chiến lược, rồi giúp phân bổ vốn vào những mảng phù hợp — thường là huy động hoặc tái cấu trúc vốn để hiện thực hóa điều đó. Một thập kỷ trải qua nhiều ngành là cách chúng tôi thật sự hiểu một doanh nghiệp và thị trường mà họ cạnh tranh.',
      p2_h: 'Vận hành', p2_b: 'Khi phù hợp, chúng tôi tham gia sở hữu và cùng vận hành. Điều đó tạo ra trách nhiệm và gắn kết lợi ích, để chúng tôi thật sự đứng về phía nhà sáng lập. Lời khuyên mà mình phải chịu trách nhiệm khác hẳn với lời khuyên chỉ để đưa ra.',
      p3_h: 'Kiến tạo', p3_b: 'Và khi doanh nghiệp cần một thứ không có sẵn để mua hay vay mượn, chúng tôi cùng xây dựng nên nó — nhận một phần giá trị tạo ra thay vì chỉ một khoản phí.',
      le_title1: 'Đồng sáng lập, Nexforge', le_title2: 'Nhà sáng lập & Thành viên Hợp danh Điều hành, LM Capital',
      kelly_title1: 'Cố vấn Cấp cao, Nexforge', kelly_title2: 'Cố vấn Cấp cao, LM Capital',
      cred_prev: 'Trước đây', cred_edu: 'Học vấn',
      le_bio: 'Ông Vũ Thành Lê là Đồng sáng lập của Nexforge và Nhà sáng lập kiêm Thành viên Hợp danh Điều hành của LM Capital, với hơn mười tám năm kinh nghiệm trong đầu tư, tài chính doanh nghiệp, M&A, huy động vốn, bất động sản, bảo hiểm, dịch vụ tài chính và chuyển đổi doanh nghiệp. Suốt thập kỷ qua, ông đã xây dựng LM Capital thành công ty tư vấn chiến lược và tài chính độc lập tập trung vào Việt Nam — đồng hành cùng các doanh nhân, tập đoàn, doanh nghiệp gia đình và nhà đầu tư quốc tế trên nhiều lĩnh vực.',
      le_bio2: 'Nexforge là chương tiếp theo của hành trình đó — mở rộng từ tư vấn chiến lược sang một mô hình vừa tư vấn, vừa đầu tư và cùng kiến tạo với doanh nghiệp Việt Nam. Tại đây, ông làm việc với các công ty tư nhân do nhà sáng lập dẫn dắt để củng cố quản trị, cấu trúc vốn, hệ thống báo cáo, hệ thống quản lý và năng lực tăng trưởng dài hạn. Trước LM Capital, ông từng giữ các vị trí cấp cao tại HSBC Việt Nam, PVI Holdings, PVI Sun Life và SonKim Land. Ông là cựu học viên Chương trình Điều hành của Trường Kinh doanh Sau đại học Stanford và có bằng Cử nhân Quản trị Kinh doanh, chuyên ngành Tài chính, của Đại học Tulsa.',
      kelly_bio: 'Ông Kelly là cố vấn của Nexforge về công nghệ và vận hành. Ông là Tổng Giám đốc của VNG Corporation — kỳ lân công nghệ đầu tiên của Việt Nam — nơi ông gia nhập năm 2019 để xây dựng VNGGames với vai trò Tổng Giám đốc, trước khi được bổ nhiệm làm Tổng Giám đốc Tập đoàn vào năm 2025. Các mảng kinh doanh của VNG trải rộng từ trò chơi và giải trí tương tác, hạ tầng AI qua GreenNode, truyền thông qua Zalo đến công nghệ tài chính qua ZaloPay.',
      kelly_bio2: 'Trước VNG, ông là Giám đốc Tài chính của Tập đoàn KIDO (trước đây là Kinh Đô) và Giám đốc Điều hành Tư vấn Doanh nghiệp tại Chứng khoán TP. Hồ Chí Minh (HSC), phụ trách mảng M&A và thị trường vốn cho các doanh nghiệp Việt Nam.',
      contact_kicker: 'Hãy viết cho chúng tôi', contact_place: 'Thành phố Hồ Chí Minh, Việt Nam',
      contact_phone: 'Điện thoại', contact_fax: 'Fax',
      reg_entity: 'Công ty TNHH LM Capital',
      reg_no: 'Mã số doanh nghiệp 0314707382 · Thành lập ngày 01/11/2017',
      reg_addr: '58 Đồng Khởi, Phường Sài Gòn, Thành phố Hồ Chí Minh, Việt Nam',
    }
  };
  var LANG = 'en';

  /* ---- inline biographies ---- */
  document.querySelectorAll('.bio-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var art = btn.closest('.bio');
      var open = art.getAttribute('data-open') === 'true';
      art.setAttribute('data-open', String(!open));
      btn.setAttribute('aria-expanded', String(!open));
      var t = btn.querySelector('.bio-toggle-text');
      if (t) t.textContent = open ? I18N[LANG].bio_more : I18N[LANG].bio_less;
    });
  });

  function setLang(l) {
    if (!I18N[l]) return;
    LANG = l;
    docEl.setAttribute('lang', l); docEl.setAttribute('data-lang', l);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (I18N[l][k] == null) return;
      el.textContent = I18N[l][k];
      if (el.hasAttribute('data-split') && !reduce) splitWords(el);
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.setAttribute('aria-current', String(b.dataset.setLang === l));
    });
    document.querySelectorAll('.bio').forEach(function (art) {
      var open = art.getAttribute('data-open') === 'true';
      var t = art.querySelector('.bio-toggle-text');
      if (t) t.textContent = open ? I18N[l].bio_less : I18N[l].bio_more;
    });
  }
  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.setLang); });
  });
})();
