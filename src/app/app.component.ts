import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroSceneComponent } from './components/intro-scene/intro-scene.component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IntroSceneComponent, DetailsSectionComponent],
  template: `
    <main class="page-wrapper" [class.scroll-unlocked]="isScrollUnlocked()">
      <!-- Intro Scene with Scroll Unrolling, Text Reveal & Petals -->
      <app-intro-scene (sceneCompleted)="onSceneCompleted()" />

      <!-- Details Section (Countdown, Map, RSVP, Footer) -->
      <app-details-section
        class="details-container"
        [class.visible]="isDetailsVisible()"
      />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: #12080a;
      color: #f7e6c4;
      font-family: var(--font-invitation);
    }

    .page-wrapper {
      position: relative;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      overflow-x: hidden;
      overflow-y: hidden;

      &.scroll-unlocked {
        height: auto;
        min-height: 100vh;
        min-height: 100dvh;
        overflow-y: auto;
      }
    }

    .details-container {
      display: block;
      opacity: 0;
      transition: opacity 0.8s ease-in;

      &.visible {
        opacity: 1;
      }
    }
  `]
})
export class AppComponent {
  readonly isScrollUnlocked = signal<boolean>(false);
  readonly isDetailsVisible = signal<boolean>(false);

  onSceneCompleted(): void {
    this.isScrollUnlocked.set(true);
    this.isDetailsVisible.set(true);
  }
}
