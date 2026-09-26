import { LitElement, css, html } from "lit";

export const COLLAPSIBLE_SECTION_TAG =
  "r4875g1-collapsible-section";

export class CollapsibleSection extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    details {
      overflow: hidden;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    summary {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.5rem;
      align-items: center;
      min-height: 2.75rem;
      padding: 0.75rem 1rem;
      box-sizing: border-box;
      cursor: pointer;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::before {
      content: "›";
      color: var(--secondary-text-color, #727272);
      font-size: 1.3rem;
      line-height: 1;
      transform: rotate(0deg);
      transition: transform 120ms ease;
    }

    details[open] summary::before {
      transform: rotate(90deg);
    }

    .title {
      min-width: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .status {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .content {
      padding: 0 1rem 1rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    slot {
      display: block;
      padding-top: 1rem;
    }
  `;

  private heading = "";
  private capabilityStatus: string | null = null;

  get sectionTitle(): string {
    return this.heading;
  }

  set sectionTitle(value: string) {
    if (value === this.heading) {
      return;
    }

    this.heading = value;
    this.requestUpdate();
  }

  get statusText(): string | null {
    return this.capabilityStatus;
  }

  set statusText(value: string | null) {
    if (value === this.capabilityStatus) {
      return;
    }

    this.capabilityStatus = value;
    this.requestUpdate();
  }

  protected render() {
    return html`
      <details>
        <summary>
          <span class="title">${this.heading}</span>
          ${this.capabilityStatus !== null
            ? html`<span class="status">${this.capabilityStatus}</span>`
            : ""}
        </summary>
        <div class="content">
          <slot></slot>
        </div>
      </details>
    `;
  }
}

if (!customElements.get(COLLAPSIBLE_SECTION_TAG)) {
  customElements.define(
    COLLAPSIBLE_SECTION_TAG,
    CollapsibleSection,
  );
}
