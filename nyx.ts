import { Plugin, Source, Novel, Chapter } from "@lnreader/plugin";

export class NyxTranslationPlugin extends Plugin {
  constructor() {
    super({
      id: "nyx-translation",
      name: "Nyx Translation",
      version: "1.0.0",
      iconUrl: "https://nyx-translation.com/favicon.ico",
      baseUrl: "https://nyx-translation.com",
      description: "A plugin to fetch web novels from Nyx Translation",
    });
  }

  async getNovels(): Promise<Novel[]> {
    // Fetch novel list from Nyx Translation website
    const response = await this.request(`${this.baseUrl}/novels/`);
    const document = this.parseHtml(response);
    
    return document.querySelectorAll(".novel-item").map((element) => ({
      id: element.getAttribute("data-id"),
      title: element.querySelector(".novel-title").textContent.trim(),
      coverUrl: element.querySelector("img").getAttribute("src"),
      url: element.querySelector("a").getAttribute("href"),
      author: element.querySelector(".novel-author")?.textContent.trim() || "Unknown",
      status: element.querySelector(".novel-status")?.textContent.trim() || "Unknown",
    }));
  }

  async getChapters(novelId: string): Promise<Chapter[]> {
    // Fetch chapter list for a given novel
    const response = await this.request(`${this.baseUrl}/novels/${novelId}`);
    const document = this.parseHtml(response);
    
    return document.querySelectorAll(".chapter-list a").map((element) => ({
      id: element.getAttribute("href"),
      title: element.textContent.trim(),
      url: element.getAttribute("href"),
      releaseDate: element.querySelector(".chapter-date")?.textContent.trim() || "Unknown",
    }));
  }

  async getChapterContent(chapterId: string): Promise<string> {
    // Fetch chapter content
    const response = await this.request(`${this.baseUrl}${chapterId}`);
    const document = this.parseHtml(response);
    
    return document.querySelector(".chapter-content").innerHTML.trim();
  }
}

export default new NyxTranslationPlugin();