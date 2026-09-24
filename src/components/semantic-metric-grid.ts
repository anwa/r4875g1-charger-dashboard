import { LitElement, css, html } from "lit";

import type { SemanticRoleSnapshot } from "../api/types";
import { formatSemanticRole } from "../presentation/semantic-role-format";

export const SEMANTIC_METRIC_GRID_TAG =
  "r4875g1-semantic-metric-grid";

export interface SemanticMetricDefinition {
  label: string;
  role: string;
}

export class SemanticMetricGrid extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
      gap: 0.5rem;
    }

    .metric {
      display: grid;
      gap: 0.2rem;
      min-width: 0;
      padding: 0.65rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
    }

    .metric-label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
    }

    .metric-value {
      overflow-wrap: anywhere;
      font-weight: 600;
    }

    .metric-unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 400;
    }
  `;

  private semanticRoles: Record<string, SemanticRoleSnapshot> = {};
  private metricDefinitions: ReadonlyArray<SemanticMetricDefinition> = [];

  get roles(): Record<string, SemanticRoleSnapshot> {
    return this.semanticRoles;
  }

  set roles(value: Record<string, SemanticRoleSnapshot>) {
    if (value === this.semanticRoles) {
      return;
    }

    this.semanticRoles = value;
    this.requestUpdate();
  }

  get metrics(): ReadonlyArray<SemanticMetricDefinition> {
    return this.metricDefinitions;
  }

  set metrics(value: ReadonlyArray<SemanticMetricDefinition>) {
    if (value === this.metricDefinitions) {
      return;
    }

    this.metricDefinitions = value;
    this.requestUpdate();
  }

  protected render() {
    return html`
      <div class="metrics">
        ${this.metricDefinitions.map(({ label, role }) =>
          this.renderMetric(label, role),
        )}
      </div>
    `;
  }

  private renderMetric(label: string, role: string) {
    const display = formatSemanticRole(this.semanticRoles[role]);

    return html`
      <div class="metric">
        <span class="metric-label">${label}</span>
        <span class="metric-value">
          ${display.value}${display.unit !== null
            ? html`<span class="metric-unit">${display.unit}</span>`
            : ""}
        </span>
      </div>
    `;
  }
}

if (!customElements.get(SEMANTIC_METRIC_GRID_TAG)) {
  customElements.define(
    SEMANTIC_METRIC_GRID_TAG,
    SemanticMetricGrid,
  );
}
