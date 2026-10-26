import { describe, it, expect } from "vitest";
import {
  BASE_BOUNCE,
  EMPTY_MISSIONS,
  MISSIONS,
  TARGET_BOUNCE,
  TEXT,
  calcBounce,
  conversionLabel,
  formatTime,
  isAllGood,
  isComplete,
  isTimerDanger,
  previewStatus,
  selectedCount,
} from "../src/gameData.js";

const m = (a, b, c) => ({ 1: a, 2: b, 3: c });

describe("معدل الخروج", () => {
  it("يبدأ من 70% بدون أي اختيار", () => {
    expect(calcBounce(EMPTY_MISSIONS)).toBe(BASE_BOUNCE);
  });
  it("كل اختيار good بينقص قيمته", () => {
    expect(calcBounce(m("good", null, null))).toBe(50);
    expect(calcBounce(m(null, "good", null))).toBe(46);
    expect(calcBounce(m(null, null, "good"))).toBe(58);
  });
  it("الاختيارات bad ما بتغيرش الرقم", () => {
    expect(calcBounce(m("bad", "bad", "bad"))).toBe(70);
  });
  it("كل الاختيارات الصح توصل للمستهدف 14%", () => {
    expect(calcBounce(m("good", "good", "good"))).toBe(TARGET_BOUNCE);
  });
});

describe("حالة اللعبة", () => {
  it("isAllGood", () => {
    expect(isAllGood(m("good", "good", "good"))).toBe(true);
    expect(isAllGood(m("good", "good", "bad"))).toBe(false);
    expect(isAllGood(EMPTY_MISSIONS)).toBe(false);
  });
  it("isComplete و selectedCount", () => {
    expect(isComplete(m("bad", "good", "bad"))).toBe(true);
    expect(isComplete(m("bad", null, "bad"))).toBe(false);
    expect(selectedCount(m("bad", null, null))).toBe(1);
  });
  it("نص حالة التحويل", () => {
    expect(conversionLabel(EMPTY_MISSIONS)).toBe(TEXT.waiting);
    expect(conversionLabel(m("bad", "bad", "bad"))).toBe("منخفض (4%)");
    expect(conversionLabel(m("good", "good", "bad"))).toBe("متوسط (9%)");
    expect(conversionLabel(m("good", "good", "good"))).toBe("مرتفع جداً (24%)");
  });
  it("نص حالة المعاينة", () => {
    expect(previewStatus(m("bad", null, null))).toBe("تم تحديد 1 من 3 عناصر");
    expect(previewStatus(m("bad", "bad", "bad"))).toBe(TEXT.allSelected);
  });
});

describe("التايمر", () => {
  it("formatTime", () => {
    expect(formatTime(180)).toBe("03:00");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(-3)).toBe("00:00");
  });
  it("isTimerDanger عند 15 ثانية أو أقل", () => {
    expect(isTimerDanger(16)).toBe(false);
    expect(isTimerDanger(15)).toBe(true);
  });
});

describe("بيانات المهام", () => {
  it("3 مهام، وكل واحدة فيها خيارين bad و good", () => {
    expect(MISSIONS).toHaveLength(3);
    MISSIONS.forEach((mission) => {
      expect(Object.keys(mission.options).sort()).toEqual(["bad", "good"]);
    });
  });
});
