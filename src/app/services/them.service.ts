import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Record<string, Record<string, string>> = {
    green: {
      '--primary-bg': '#28A745',
      '--secondary-bg': '#000000',
      '--tertiary-bg': '#F5F5F5',
      '--card-bg': '#E9F5E9',
      '--primary-text': '#FFFFFF',
      '--secondary-text': '#CCCCCC',
      '--tertiary-text': '#4D4D4D',
      '--primary-btn': '#218838',
      '--secondary-btn': '#FFFFFF',
      '--hover-btn': '#1E7E34',
      '--disabled-btn': '#BDBDBD',
      '--border': '#DDDDDD',
      '--link-text': '#28A745',
      '--link-hover-text': '#1E7E34',
      '--error': '#DC3545',
      '--success': '#28A745',
      '--brand-color': '#1B5E20',
      '--teal': '#00897B',
      '--rose': '#D81B60',
      '--purple': '#6A1B9A',
      '--amber': '#FFC107',
      '--box-shadow': 'rgba(0, 0, 0, 0.15) 0px 4px 12px'
    },
    red: {
      '--primary-bg': '#D72638',
      '--secondary-bg': '#1A1A1D',
      '--tertiary-bg': '#FAFAFA',
      '--card-bg': '#FFF3F3',
      '--primary-text': '#FFFFFF',
      '--secondary-text': '#BDBDBD',
      '--tertiary-text': '#4A4A4A',
      '--primary-btn': '#C21829',
      '--secondary-btn': '#FFFFFF',
      '--hover-btn': '#A50E1D',
      '--disabled-btn': '#A0A0A0',
      '--border': '#CCCCCC',
      '--link-text': '#D72638',
      '--link-hover-text': '#B71C1C',
      '--error': '#FF3B30',
      '--success': '#28A745',
      '--brand-color': '#9B0000',
      '--teal': '#009688',
      '--rose': '#E91E63',
      '--purple': '#7B1FA2',
      '--amber': '#FFB300',
      '--box-shadow': 'rgba(255, 0, 0, 0.15) 0px 4px 12px'
    },
    blue: {
      '--primary-bg': '#007BFF',
      '--secondary-bg': '#343A40',
      '--tertiary-bg': '#F8F9FA',
      '--card-bg': '#E3F2FD',
      '--primary-text': '#FFFFFF',
      '--secondary-text': '#CCCCCC',
      '--tertiary-text': '#495057',
      '--primary-btn': '#0056B3',
      '--secondary-btn': '#FFFFFF',
      '--hover-btn': '#004494',
      '--disabled-btn': '#C0C0C0',
      '--border': '#DDDDDD',
      '--link-text': '#007BFF',
      '--link-hover-text': '#0056B3',
      '--error': '#E63946',
      '--success': '#28A745',
      '--brand-color': '#0056B3',
      '--teal': '#00838F',
      '--rose': '#F50057',
      '--purple': '#512DA8',
      '--amber': '#FFD600',
      '--box-shadow': 'rgba(0, 123, 255, 0.15) 0px 4px 12px'
    },
    orange: {
      '--primary-bg': '#FF6600',
      '--secondary-bg': '#1C1C1C',
      '--tertiary-bg': '#F7F3F3',
      '--card-bg': '#FFF3E0',
      '--primary-text': '#FFFFFF',
      '--secondary-text': '#AAAAAA',
      '--tertiary-text': '#4A4A4A',
      '--primary-btn': '#E65C00',
      '--secondary-btn': '#FFFFFF',
      '--hover-btn': '#CC5200',
      '--disabled-btn': '#A8A8A8',
      '--border': '#CCCCCC',
      '--link-text': '#FF6600',
      '--link-hover-text': '#E65100',
      '--error': '#FF3B30',
      '--success': '#28A745',
      '--brand-color': '#BF360C',
      '--teal': '#00796B',
      '--rose': '#EC407A',
      '--purple': '#8E24AA',
      '--amber': '#FFCA28',
      '--box-shadow': 'rgba(255, 102, 0, 0.15) 0px 4px 12px'
    },
    yellow: {
      '--primary-bg': '#FFC107',
      '--secondary-bg': '#212121',
      '--tertiary-bg': '#FCF6E8',
      '--card-bg': '#FFFDE7',
      '--primary-text': '#FFFFFF',
      '--secondary-text': '#BDBDBD',
      '--tertiary-text': '#5C5C5C',
      '--primary-btn': '#FFA000',
      '--secondary-btn': '#FFFFFF',
      '--hover-btn': '#E69500',
      '--disabled-btn': '#B8B8B8',
      '--border': '#DDDDDD',
      '--link-text': '#FFC107',
      '--link-hover-text': '#FF8F00',
      '--error': '#FF3B30',
      '--success': '#28A745',
      '--brand-color': '#FF6F00',
      '--teal': '#004D40',
      '--rose': '#D81B60',
      '--purple': '#6A1B9A',
      '--amber': '#FFA000',
      '--box-shadow': 'rgba(255, 193, 7, 0.15) 0px 4px 12px'
    }
  };

  setTheme(theme: keyof typeof this.themes) {
    const themeColors = this.themes[theme];
    if (themeColors) {
      Object.keys(themeColors).forEach((key) => {
        document.documentElement.style.setProperty(key, themeColors[key]);
      });
    }
  }
}
