const CONTACT_EMAIL = "411545478@qq.com";

const inquiryForm = document.querySelector("#inquiry-form");
const formStatus = document.querySelector("#form-status-text");
const copyButton = document.querySelector("#copy-email");

function setStatus(message) {
  if (formStatus) {
    formStatus.textContent = message;
  }
}

inquiryForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!inquiryForm.reportValidity()) {
    return;
  }

  const form = new FormData(inquiryForm);
  const name = String(form.get("name") || "").trim() || "未填写";
  const need = String(form.get("need") || "").trim();
  const volume = String(form.get("volume") || "").trim() || "还不确定";
  const details = String(form.get("details") || "").trim();

  const subject = `知识库咨询｜${need}`;
  const body = [
    "你好，我想咨询私人知识库服务。",
    "",
    `称呼：${name}`,
    `最想解决：${need}`,
    `资料规模：${volume}`,
    "",
    "最常见的问题：",
    details,
    "",
    "说明：本邮件只提交需求摘要，不包含密码、验证码、银行卡、客户名单或合同原文。"
  ].join("\n");

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.__lastInquiryMailto = mailto;
  setStatus("正在打开邮箱。请在邮箱里确认内容并点击“发送”。");
  window.location.href = mailto;
});

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    setStatus("邮箱已复制：411545478@qq.com");
  } catch {
    const helper = document.createElement("textarea");
    helper.value = CONTACT_EMAIL;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
    setStatus("邮箱已复制：411545478@qq.com");
  }
});
