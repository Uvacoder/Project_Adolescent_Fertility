const BASE_URL = 'https://public.flourish.studio/';

function getWindowHeight() {
  return window.innerHeight;
}

function isSafari() {
  return (
    (-1 !== navigator.userAgent.indexOf('Safari') ||
      -1 !== navigator.userAgent.indexOf('iPhone')) &&
    -1 == navigator.userAgent.indexOf('Chrome')
  );
}

const createFlourishStory = (storyId, slide = null) => {
  const flourishContainer = document.querySelector('.flourish-container');
  const existingIframe = flourishContainer.querySelector('iframe');
  if (existingIframe && existingIframe.src.includes(`story/${storyId}`)) {
    const embedUrl = `${BASE_URL}story/${storyId}/embed${
      slide ? `#slide-${slide}` : '#slide-0'
    }`;

    existingIframe.src = embedUrl;
    return;
  }

  const embedUrl = `${BASE_URL}story/${storyId}/embed${
    slide ? `#slide-${slide}` : '#slide-0'
  }`;

  let chartWidth = flourishContainer.getAttribute('data-width');
  let chartHeight = flourishContainer.getAttribute('data-height');

  if (!chartHeight) {
    chartHeight = getWindowHeight() + 'px';
  }

  const iframe = document.createElement('iframe');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('src', embedUrl);

  flourishContainer.appendChild(iframe);

  chartWidth
    ? (iframe.style.width = chartWidth)
    : isSafari()
    ? (iframe.style.width = flourishContainer.offsetWidth + 'px')
    : (iframe.style.width = '100%');

  chartHeight &&
    ('%' === chartHeight.charAt(chartHeight.length - 1) &&
      (chartHeight =
        (parseFloat(chartHeight) / 100) *
          flourishContainer.parentNode.offsetHeight +
        'px'),
    (iframe.style.height = chartHeight));
};

const loadExternalFlourishScript = () => {
  const flourishScript = document.createElement('script');
  flourishScript.type = 'text/javascript';
  flourishScript.async = true;
  flourishScript.src = 'https://public.flourish.studio/resources/embed.js';
  document.getElementsByTagName('head')[0].appendChild(flourishScript);
};

export { createFlourishStory, loadExternalFlourishScript };
