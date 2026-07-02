<template>
  <q-page class="welcome-screen" :style="backgroundStyle">
    <div class="animated-bg">
      <div class="gradient-orb orb-1" :style="orb1Style"></div>
      <div class="gradient-orb orb-2" :style="orb2Style"></div>
      <div class="gradient-orb orb-3" :style="orb3Style"></div>
    </div>

    <div class="content-container">
      <div class="welcome-card">
        <div class="icon-container">
          <div class="icon-glow" :style="iconGlowStyle"></div>
          <div class="icon-wrapper" :style="iconWrapperStyle">
            <q-icon name="business_center" class="main-icon" :style="mainIconStyle" />
          </div>
          <div class="floating-particles">
            <span class="particle" v-for="i in 6" :key="i" :style="particleStyle"></span>
          </div>
        </div>
        
        <div class="text-content">
          <h1 class="main-title" :style="titleStyle">Legal Monitoring System</h1>
          <p class="subtitle">Selamat Datang<br/>Legal Monitoring System DBC</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { domain } from './../utils';

const currentDomain = computed(() => domain());

// Domain color configurations
const domainColors = {
  'WDJR': {
    primary: '#003399',
    secondary: '#00b2e3',
    bgLight: '#e0f2fe',
    bgMedium: '#bfdbfe',
    bgDark: '#93c5fd'
  },
  'WTUR': {
    primary: '#003399',
    secondary: '#00b2e3',
    bgLight: '#e0f2fe',
    bgMedium: '#bfdbfe',
    bgDark: '#93c5fd'
  },
  'DJM': {
    primary: '#003b7b',
    secondary: '#231f20',
    bgLight: '#e0f2fe',
    bgMedium: '#bfdbfe',
    bgDark: '#93c5fd'
  },
  'DTU': {
    primary: '#003b7b',
    secondary: '#231f20',
    bgLight: '#e0f2fe',
    bgMedium: '#bfdbfe',
    bgDark: '#93c5fd'
  },
  'GBC': {
    primary: '#ee4034',
    secondary: '#BABCBE',
    bgLight: '#fef2f2',
    bgMedium: '#fecaca',
    bgDark: '#fca5a5'
  },
  'WNR': {
    primary: '#ee4034',
    secondary: '#BABCBE',
    bgLight: '#fef2f2',
    bgMedium: '#fecaca',
    bgDark: '#fca5a5'
  },
  'DBO': {
    primary: '#ee4034',
    secondary: '#BABCBE',
    bgLight: '#fef2f2',
    bgMedium: '#fecaca',
    bgDark: '#fca5a5'
  },
  'DFR': {
    primary: '#ef4123',
    secondary: '#4d5e6c',
    bgLight: '#fff7ed',
    bgMedium: '#fed7aa',
    bgDark: '#fdba74'
  },
  'RBG': {
    primary: '#A8479A',
    secondary: '#5BAF42',
    bgLight: '#faf5ff',
    bgMedium: '#e9d5ff',
    bgDark: '#d8b4fe'
  },
  'RBS': {
    primary: '#A8479A',
    secondary: '#5BAF42',
    bgLight: '#faf5ff',
    bgMedium: '#e9d5ff',
    bgDark: '#d8b4fe'
  }
};

const getColorConfig = computed(() => {
  return domainColors[currentDomain.value] || domainColors['DFR'];
});

// Dynamic styles based on domain
const backgroundStyle = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.bgLight} 0%, ${getColorConfig.value.bgMedium} 50%, ${getColorConfig.value.bgLight} 100%)`
}));

const orb1Style = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.primary}40, ${getColorConfig.value.secondary}40)`
}));

const orb2Style = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.secondary}40, ${getColorConfig.value.primary}40)`
}));

const orb3Style = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.primary}30, ${getColorConfig.value.secondary}30)`
}));

const iconGlowStyle = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.primary}, ${getColorConfig.value.secondary})`
}));

const iconWrapperStyle = computed(() => ({
  border: `2px solid ${getColorConfig.value.primary}20`,
  boxShadow: `0 20px 60px ${getColorConfig.value.primary}25`
}));

const mainIconStyle = computed(() => ({
  color: getColorConfig.value.primary,
  filter: `drop-shadow(0 4px 12px ${getColorConfig.value.primary}40)`
}));

const particleStyle = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.primary}, ${getColorConfig.value.secondary})`
}));

const titleStyle = computed(() => ({
  background: `linear-gradient(135deg, ${getColorConfig.value.primary}, ${getColorConfig.value.secondary})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  filter: `drop-shadow(0 2px 8px ${getColorConfig.value.primary}25)`
}));
</script>
<style scoped>
.welcome-screen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  overflow: hidden;
  /* Background will be set dynamically via inline style */
}

.animated-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
  animation: float-orb 20s ease-in-out infinite;
  /* Background will be set dynamically via inline style */
}

.orb-1 {
  width: 400px;
  height: 400px;
  top: -20%;
  left: -10%;
}

.orb-2 {
  width: 350px;
  height: 350px;
  bottom: -20%;
  right: -10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
}

.content-container {
  position: relative;
  z-index: 10;
  padding: 2rem;
}

.welcome-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.icon-container {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(40px);
  animation: pulse-glow 3s ease-in-out infinite;
  /* Background will be set dynamically via inline style */
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.2); opacity: 0.25; }
}

.icon-wrapper {
  position: relative;
  background: white;
  border-radius: 50%;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float-icon 4s ease-in-out infinite;
  /* Border and box-shadow will be set dynamically via inline style */
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.main-icon {
  font-size: 4.5rem;
  /* Color and filter will be set dynamically via inline style */
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0.4;
  animation: float-particle 3s ease-in-out infinite;
  /* Background will be set dynamically via inline style */
}

.particle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
.particle:nth-child(2) { top: 80%; left: 10%; animation-delay: 0.5s; }
.particle:nth-child(3) { top: 20%; right: 15%; animation-delay: 1s; }
.particle:nth-child(4) { bottom: 15%; right: 20%; animation-delay: 1.5s; }
.particle:nth-child(5) { top: 50%; left: 5%; animation-delay: 2s; }
.particle:nth-child(6) { bottom: 30%; right: 5%; animation-delay: 2.5s; }

@keyframes float-particle {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
}

.text-content {
  text-align: center;
  max-width: 600px;
}

.main-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  animation: title-glow 2s ease-in-out infinite;
  /* Background, clip, and filter will be set dynamically via inline style */
}

@keyframes title-glow {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .main-title { font-size: 2rem; }
  .subtitle { font-size: 1rem; }
  .icon-wrapper { width: 100px; height: 100px; }
  .main-icon { font-size: 3.5rem; }
  .icon-container { width: 140px; height: 140px; }
}
</style>
