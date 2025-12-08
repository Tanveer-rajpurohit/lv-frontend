import { STORAGE_KEYS } from "../../constants/storage-keys";

class GenAIService {
  private mouseMovements: { x: number; y: number; timestamp: number }[] = [];
  private readonly MAX_MOUSE_MOVEMENTS = 100;
  private lastMouseEventTime = 0;

  private trackMouse = (event: MouseEvent) => {
    const now = Date.now();
    if (now - this.lastMouseEventTime < 100) return;
    this.lastMouseEventTime = now;

    this.mouseMovements.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: now,
    });

    if (this.mouseMovements.length > this.MAX_MOUSE_MOVEMENTS) {
      this.mouseMovements.shift();
    }
  };

  startTrackingMouse() {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this.trackMouse);
    }
  }

  stopTrackingMouse() {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", this.trackMouse);
    }
  }

  private getMouseTrackingData() {
    const rawData = this.mouseMovements.slice(-this.MAX_MOUSE_MOVEMENTS);
    this.mouseMovements = [];

    return rawData.map((move) => ({
      additionalProp1: move.x,
      additionalProp2: move.y,
      additionalProp3: move.timestamp,
    }));
  }

  startRegistrationTimer() {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEYS.REGISTRATION_START_TIME,
        Date.now().toString()
      );
    }
  }

  stopRegistrationTimer() {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", this.trackMouse);
    }
  }

  private getRegistrationTime(): number {
    if (typeof window !== "undefined") {
      const startTime = localStorage.getItem(STORAGE_KEYS.REGISTRATION_START_TIME);
      if (startTime) {
        const duration = Date.now() - parseInt(startTime, 10);
        localStorage.removeItem(STORAGE_KEYS.REGISTRATION_START_TIME);
        return Math.round(duration / 1000);
      }
    }
    return 0;
  }

  private getDeviceId(): string {
    const existing = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!existing) {
      const id = self.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
      return id;
    }
    return existing;
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    const screenWidth = window.innerWidth;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    const isMobileUA = /Mobi|Android|webOS|iPhone|iPod/i.test(ua);
    const isTabletUA = /iPad|Tablet/i.test(ua);

    if (isMobileUA || (screenWidth <= 768 && isTouchDevice)) {
      return "mobile";
    }

    if (isTabletUA || (screenWidth > 768 && screenWidth <= 1024 && isTouchDevice)) {
      return "tablet";
    }

    return "desktop";
  }

  getDeviceInfo() {
    if (typeof window === "undefined") {
      // On server, just return minimal object; signup Zod schema marks device_data optional
      return undefined;
    }

    return {
      device_id: this.getDeviceId(),
      device_type: this.getDeviceType(),
      user_agent: navigator.userAgent || "",
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language || "",
      mouse_movements: this.getMouseTrackingData(),
      form_completion_time: this.getRegistrationTime(),
    };
  }
}

export const genAIService = new GenAIService();
