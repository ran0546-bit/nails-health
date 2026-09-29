// 衛福部醫療廣告用字檢查：非醫療店家不得宣稱醫療效能或改變身體結構。
// 依《藥事法》《醫療法》《化粧品衛生安全管理法》整理，僅供撰稿提醒，不代表法律意見。

export type ComplianceRule = {
  terms: string[];
  reason: string;
  suggestion: string;
};

export const complianceRules: ComplianceRule[] = [
  {
    terms: ["灰指甲", "甲溝炎", "凍甲", "嵌甲", "甲癬", "黴菌感染", "綠膿桿菌", "甲床分離"],
    reason: "疾病名稱，宣傳時容易被認定為宣稱醫療效能",
    suggestion: "改為描述外觀（如「指甲變色、增厚」「甲緣卡進皮膚」），並加註「建議先尋求皮膚科醫師診治」",
  },
  {
    terms: ["治療", "治癒", "根治", "治本", "診斷", "矯正", "處方", "開藥", "療效", "藥用", "醫療級"],
    reason: "治療或醫療行為用語",
    suggestion: "改用「護理」「保養」「修飾甲型」「輔助戒除咬甲習慣」等字眼",
  },
  {
    terms: ["殺菌", "消炎", "抗黴菌", "抗菌"],
    reason: "宣稱醫療功效",
    suggestion: "改用「深層清潔」「保持指甲乾爽潔淨」",
  },
  {
    terms: ["擴充甲床", "甲床擴充", "重建甲床", "再生甲床", "甲床再生", "促進甲肉生長", "修復神經", "刺激指甲生長", "二次發育"],
    reason: "宣稱改變身體結構或生理機能",
    suggestion: "改用「修飾甲型」「視覺修長」「養成好看的甲肉比例」",
  },
  {
    terms: ["修復"],
    reason: "暗示改變組織狀態",
    suggestion: "改用「強化指甲韌度」「撫平指甲表面凹凸」",
  },
  {
    terms: ["100%", "百分百", "保證", "永久", "一勞永逸", "徹底改善"],
    reason: "保證或極端用語，易被認定誇大不實",
    suggestion: "刪除保證性字眼，改為描述服務內容",
  },
];

export type ComplianceHit = { term: string; count: number; rule: ComplianceRule };

export function checkCompliance(text: string): ComplianceHit[] {
  const hits: ComplianceHit[] = [];
  for (const rule of complianceRules) {
    for (const term of rule.terms) {
      const count = text.split(term).length - 1;
      if (count > 0) hits.push({ term, count, rule });
    }
  }
  return hits;
}
