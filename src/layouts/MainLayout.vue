<template>
  <q-layout view="lHh Lpr lff" class="main-layout"> <!-- view="hHh lpR fFf" -->
    <q-header elevated class="modern-header">
      <q-toolbar class="main-toolbar" :class="$q.dark.mode ? `${Header} text-white` : `text-white ${Header}`"> 
        <q-btn v-if="menuType == false" flat @click="drawer = !drawer" round class="menu-btn" icon="menu" size="lg" />
        
        <q-toolbar-title class="modern-title">
          <div class="title-container">
            <div class="tw-flex tw-items-center tw-gap-2">
              <q-icon name="description" size="20px" class="tw-text-white/90" />
              <span class="app-name">Legal Monitoring System</span>
            </div>
            <span class="app-subtitle">Legal Monitoring System</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <div class="flex items-center mr-4">
          <div class="bg-white/15 px-4 py-2 rounded-[20px] text-sm font-medium flex items-center backdrop-blur-[10px] gap-2">
            <q-icon name="business" />
            {{ Unit }}
          </div>
          
          <div class="tw-w-4"></div>
                  
          <q-btn round flat class="transition-all duration-300 hover:-translate-y-0.5" @click="openProfileDrawer">
            <q-tooltip class="tw-bg-black/80 tw-text-white">View Profile</q-tooltip>
            <q-avatar size="40px" class="header-avatar">
              <!-- <img v-if="avatarImage" :src="avatarImage" class="avatar-img" /> -->
              <!-- <div v-else class="font-bold text-lg">{{ Nama.substring(0,1) }}</div> -->
              <div class="font-bold text-lg">{{ Nama.substring(0,1) }}</div>
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>

      <q-toolbar v-if="$q.screen.gt.sm && menuType == true" inset class="bg-grey-3">
        <div class="
            GL__toolbar-link
            q-ml-xs q-gutter-md
            text-body2 text-weight-light
            row
            items-center
            no-wrap
          ">
          <template v-for="(menuItem, index) in listMenu" :key="index">
            <div v-if="menuItem.children.length == 0">
              <router-link :to="menuItem.menu_link">
                <a href="javascript:void(0)" class="text-black">
                  <!-- <q-icon size="18px" class="icon-menu" :name="fasBook" /> -->
                  <q-icon size="18px" :name="menuItem.menu_icon" />
                  {{ menuItem.menu_name }}
                </a>
              </router-link>
            </div>
            <div v-else>
              <a href="javascript:void(0)" class="text-black">
                <q-icon size="18px" :name="menuItem.menu_icon" />
                {{ menuItem.menu_name }}
                <q-menu auto-close class="q-menu-navbar">
                  <q-list dense>
                    <q-item v-for="(menuItemChild, index) in menuItem.children" :key="index" clickable
                      :to="menuItemChild.menu_link">
                      <q-item-section>
                        {{ menuItemChild.menu_name }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </a>
            </div>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer elevated dense>
      <q-toolbar :class="$q.dark.mode ? `${Footer} text-white` : `${Footer} text-white`">
        <q-toolbar-title class="text-subtitle2">Copyright &#169; 2026 IT DBC
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-drawer v-if="menuType == false" v-model="drawer" show-if-above :width="320" :breakpoint="500" 
      class="modern-drawer" :class="$q.dark.mode ? 'bg-blue-grey-3 text-black' : `side-${Domain}`">
      <div class="drawer-header-fixed" :style="drawerHeaderStyle">
          <div class="logo-section">
            <img :src="`logo.png`" alt="Logo" class="drawer-logo" />
          </div>
          
          <div class="user-profile-section">
            <div class="profile-background relative" :style="profileBackgroundStyle" :class="{ 'has-bg-image': profileBackgroundImage }">
              <div v-if="loadingImages" class="absolute inset-0 z-[5] tw-bg-white/10 tw-backdrop-blur-sm">
                <q-skeleton type="rect" class="tw-w-full tw-h-full" animation="wave" />
              </div>
              <div v-else-if="uploadingBackground" class="absolute inset-0 bg-black/50 z-[5] flex items-center justify-center">
                <q-spinner-dots color="white" size="50px" />
              </div>
              <div class="absolute !tw-top-2 !tw-left-2 flex gap-1 transition-opacity duration-300 z-[10]">
                <q-btn 
                  round 
                  flat 
                  icon="photo_camera" 
                  size="sm" 
                  class="tw-bg-black/20 tw-text-white tw-border-2 tw-border-white hover:tw-bg-black/40 hover:tw-scale-110 tw-shadow-xl"
                  @click="$refs.fileInput.click()"
                />
                <q-btn 
                  v-if="profileBackgroundImage"
                  round 
                  flat 
                  icon="close" 
                  size="sm" 
                  class="tw-bg-black/20 tw-text-white tw-border-2 tw-border-white hover:tw-bg-red-600 hover:tw-scale-110 tw-shadow-xl"
                  @click="removeProfileBackground"
                />
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                class="hidden-input" 
                @change="handleProfileBackgroundUpload"
              />
              <input 
                ref="fileInput2" 
                type="file" 
                accept="image/*" 
                class="hidden-input" 
                @change="handleAvatarUpload"
              />
              <q-avatar size="60px" class="user-avatar relative z-[2] cursor-pointer" :class="`user-avatar-bg-${Domain}`" @click="!loadingImages && $refs.fileInput2.click()">
                <q-skeleton v-if="loadingImages" type="circle" size="60px" animation="wave" />
                <div v-else-if="uploadingAvatar" class="absolute inset-0 bg-black/50 z-[10] flex items-center justify-center rounded-full">
                  <q-spinner-dots color="white" size="30px" />
                </div>
                <img v-if="avatarImage" :src="avatarImage" class="avatar-img" />
                <div v-else class="user-initial tw-bg-black/30 tw-backdrop-blur-sm tw-border-2 tw-border-white/80 tw-rounded-full">{{ Nama.substring(0,1) }}</div>
                <div class="avatar-overlay tw-bg-black/20 tw-border-2 tw-border-white">
                  <q-icon name="photo_camera" size="sm" class="tw-text-white" />
                </div>
                <q-tooltip class="tw-bg-black/80 tw-text-white">Click to change avatar</q-tooltip>
              </q-avatar>
              <div v-if="loadingImages" class="tw-text-white tw-relative tw-z-[2] tw-space-y-2">
                <q-skeleton type="text" width="80px" height="24px" animation="wave" class="tw-rounded-full" />
                <q-skeleton type="text" width="120px" height="20px" animation="wave" />
              </div>
              <div v-else class="tw-text-white tw-relative tw-z-[2]">
                <div class="tw-inline-block tw-bg-white/[0.07] tw-backdrop-blur-md tw-px-3 tw-py-1.5 tw-rounded-full tw-border tw-border-white/50 tw-mb-2 tw-shadow-lg tw-cursor-pointer hover:tw-bg-white/[0.12] tw-transition-all" @click="openProfileDrawer">
                  <div class="tw-text-xs tw-font-semibold tw-text-white tw-drop-shadow-[1px_1px_3px_rgba(0,0,0,0.8)] tw-drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]">{{ nik() }}</div>
                </div>
                <div class="tw-font-bold tw-text-lg tw-drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] tw-drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] tw-cursor-pointer" @click="openProfileDrawer">
                  {{ nama() }}
                  <q-tooltip class="tw-bg-black/80 tw-text-white">Click to view profile</q-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="search-section">
            <q-input 
              v-model="searchQuery" 
              placeholder="Search menu..."
              dense
              outlined
              class="search-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" class="search-icon" />
              </template>
            </q-input>
          </div>
      </div>
      
      <div style="height: 400px;"></div>
      
      <q-scroll-area style="height: calc(100vh - 400px);">
        
        <div class="navigation-section">
          <div v-if="!listMenu || listMenu.length === 0" class="no-menu-message">
            <q-icon name="menu" size="2rem" color="grey-5" />
            <div class="text-grey-6 q-mt-sm">No menu items available</div>
          </div>
          <q-list v-else class="modern-menu-list">
            <template v-for="(menuItem, index) in filteredMenu" :key="index">
              <div v-if="menuItem.children.length == 0">
                <q-item :to="menuItem.menu_link.startsWith('/') ? menuItem.menu_link : '/' + menuItem.menu_link" class="menu-item" :class="[`menu-item-domain-${Domain}`, $q.dark.mode ? 'bg-blue-grey-9 text-black' : `side-${Domain}-1`]">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon :name="menuItem.menu_icon" class="menu-icon" :style="iconBubbleStyle" />
                  </q-item-section>
                  <q-item-section class="menu-text-section">
                    <span class="menu-text" v-html="highlightText(menuItem.menu_name)"></span>
                  </q-item-section>
                </q-item>
              </div>
              <div v-else>
                <q-expansion-item class="menu-expansion" :class="`menu-expansion-domain-${Domain}`" :content-inset-level="0.5" expand-separator :default-opened="hasMatchingChildren(menuItem)">
                  <template #header>
                    <q-item class="expansion-header" :class="`expansion-header-domain-${Domain}`">
                      <q-item-section avatar class="menu-icon-section">
                        <q-icon :name="menuItem.menu_icon" class="menu-icon" :style="iconBubbleStyle" />
                      </q-item-section>
                      <q-item-section>
                        <span class="menu-text" v-html="highlightText(menuItem.menu_name)"></span>
                      </q-item-section>
                    </q-item>
                  </template>
                  
                  <template v-for="(menuItemChild, index) in menuItem.filteredChildren" :key="index">
                    <q-item clickable :to="menuItemChild.menu_link.startsWith('/') ? menuItemChild.menu_link : '/' + menuItemChild.menu_link" 
                      :class="[currentRoute.includes(menuItemChild.menu_link) ? 'menu-child-active' : 'menu-child', `menu-child-domain-${Domain}`]"
                      class="menu-child-item">
                      <q-item-section avatar class="child-icon-section">
                        <q-icon :name="menuItemChild.menu_icon" class="child-icon" :style="iconBubbleStyle" />
                      </q-item-section>
                      <q-item-section>
                        <span class="child-text" v-html="highlightText(menuItemChild.menu_name)"></span>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-expansion-item>
              </div>
            </template>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <ProfileDrawer 
      v-model="profileDrawer" 
      :domain="Domain" 
      :user-name="nama()" 
      :unit="Unit" 
      :avatar-image="avatarImage" 
      :background-image="profileBackgroundImage"
      :user-profile="userProfile"
      :loading="loadingProfile"
      @avatar-upload="handleAvatarUpload"
      @background-upload="handleProfileBackgroundUpload"
      @background-remove="removeProfileBackground"
      @logout="logoutUser"
    />

    <q-page-container style="overflow-x: auto;">
      <!-- <q-page padding> -->
      <router-view />
      <!-- </q-page> -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref,computed,onMounted  } from "vue";
import { useQuasar } from "quasar";
import axios from "axios"
import { empid, nama, nik, ParseError, domain,unit,idleTime, spinnerBall, role, decryptMessage } from "./../utils";
import { clearSession, redirectToLogin } from "./../session.js";
import { useRouter, useRoute } from "vue-router";
import { useBrowserLocation,useTimeoutFn } from '@vueuse/core'
import ProfileDrawer from './../components/ProfileDrawer.vue';
import { useNotify } from "./../composables/useNotify";

const $q = useQuasar();
const { success, error } = useNotify();
const drawer = ref(false);
const profileDrawer = ref(false);
const userProfile = ref(null);
const loadingProfile = ref(false);
const listMenu = ref([]);
const searchQuery = ref('');
const mode = ref(false);
const menuType = ref(false); /*false untuk sidemenu & true untuk topmenu*/
const listDomain = ref([]);
const domainSearchQuery = ref('');
const Domain = ref(domain());
const pattern = `${domain()} - `;
const Unit = ref(unit().startsWith(pattern) ? unit().substring(pattern.length) : unit());
const Nama = ref(nama());
const Header= ref(false);
const Footer= ref(false);
const timeout = ref(idleTime());
const location = useBrowserLocation();
const Color = ref();
const router = useRouter();
const colorBrand = ref([]);
const profileBackgroundImage = ref(null);
const avatarImage = ref(null);
const uploadingBackground = ref(false);
const uploadingAvatar = ref(false);
const loadingImages = ref(true);

const currentRoute = computed(() => {
        return router.currentRoute.value.path
    });

const drawerHeaderStyle = computed(() => {
  const domainColors = {
    'WDJR': 'linear-gradient(135deg, #003399 0%, #00b2e3 100%)',
    'WTUR': 'linear-gradient(135deg, #003399 0%, #00b2e3 100%)',
    'DJM': 'linear-gradient(135deg, #003b7b 0%, #231f20 100%)',
    'DTU': 'linear-gradient(135deg, #003b7b 0%, #231f20 100%)',
    'GBC': 'linear-gradient(135deg, #ee4034 0%, #BABCBE 100%)',
    'WNR': 'linear-gradient(135deg, #ee4034 0%, #BABCBE 100%)',
    'DBO': 'linear-gradient(135deg, #ee4034 0%, #BABCBE 100%)',
    'DFR': 'linear-gradient(135deg, #ef4123 0%, #4d5e6c 100%)',
    'RBG': 'linear-gradient(135deg, #A8479A 0%, #5BAF42 100%)',
    'RBS': 'linear-gradient(135deg, #A8479A 0%, #5BAF42 100%)'
  };
  
  return {
    background: domainColors[Domain.value] || domainColors['DFR']
  };
});

const filteredMenu = computed(() => {
  if (!listMenu.value || !Array.isArray(listMenu.value)) {
    return [];
  }
  
  if (!searchQuery.value) {
    return listMenu.value.map(item => ({
      ...item,
      filteredChildren: item.children || []
    }));
  }
  
  const query = searchQuery.value.toLowerCase();
  return listMenu.value.filter(item => {
    const matchesParent = item.menu_name.toLowerCase().includes(query);
    const filteredChildren = (item.children || []).filter(child => 
      child.menu_name.toLowerCase().includes(query)
    );
    return matchesParent || filteredChildren.length > 0;
  }).map(item => {
    const matchesParent = item.menu_name.toLowerCase().includes(query);
    const filteredChildren = (item.children || []).filter(child => 
      child.menu_name.toLowerCase().includes(query)
    );
    
    return {
      ...item,
      filteredChildren: matchesParent ? item.children : filteredChildren
    };
  });
});

const highlightText = (text) => {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
};

const hasMatchingChildren = (menuItem) => {
  if (!searchQuery.value) return false;
  const query = searchQuery.value.toLowerCase();
  return (menuItem.children || []).some(child => 
    child.menu_name.toLowerCase().includes(query)
  );
};

const iconBubbleStyle = computed(() => {
  const domainColors = {
    'WDJR': 'linear-gradient(135deg, #003399, #00b2e3)',
    'DTU': 'linear-gradient(135deg, #003399, #00b2e3)',
    'DJM': 'linear-gradient(135deg, #003b7b, #231f20)',
    'DTU': 'linear-gradient(135deg, #003b7b, #231f20)',
    'GBC': 'linear-gradient(135deg, #ee4034, #ff6b6b)',
    'WNR': 'linear-gradient(135deg, #ee4034, #ff6b6b)',
    'DBO': 'linear-gradient(135deg, #ee4034, #ff6b6b)',
    'DFR': 'linear-gradient(135deg, #ef4123, #ff6b6b)',
    'RBG': 'linear-gradient(135deg, #A8479A, #5BAF42)',
    'RBS': 'linear-gradient(135deg, #A8479A, #5BAF42)'
  };
  
  return {
    background: domainColors[Domain.value] || domainColors['DFR']
  };
});

const randomColor = () => {
  const randomValue = () => Math.floor(Math.random() * 128); // Values between 0 and 127 for darker tones
  const toHex = (value) => value.toString(16).padStart(2, '0'); // Convert to hex and pad with 0
  const r = randomValue();
  const g = randomValue();
  const b = randomValue();
  Color.value =`#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const profileBackgroundStyle = computed(() => {
  if (profileBackgroundImage.value) {
    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${profileBackgroundImage.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return {};
});



const handleProfileBackgroundUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('empid', empid());
    formData.append('type', 'background');
    
    try {
      uploadingBackground.value = true;
      const res = await axios.post(`${import.meta.env.VITE_API}uploadProfileImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      profileBackgroundImage.value = res.data.imageUrl;
      event.target.value = '';
      uploadingBackground.value = false;
    } catch (error) {
      uploadingBackground.value = false;
      error(error?.response?.data?.message || 'Gagal upload gambar');
    }
  }
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('empid', empid());
    formData.append('type', 'avatar');
    
    try {
      uploadingAvatar.value = true;
      const res = await axios.post(`${import.meta.env.VITE_API}uploadProfileImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      avatarImage.value = res.data.imageUrl;
      event.target.value = '';
      uploadingAvatar.value = false;
    } catch (err) {
      uploadingAvatar.value = false;
      error(err?.response?.data?.message || 'Gagal upload gambar');
    }
  }
};

const removeProfileBackground = async () => {
  try {
    spinnerBall();
    await axios.post(`${import.meta.env.VITE_API}removeProfileImage`, {
      empid: empid(),
      type: 'background'
    });
    profileBackgroundImage.value = null;
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    error(err?.response?.data?.message || 'Gagal menghapus gambar');
  }
};

const getProfileImages = async () => {
  try {
    loadingImages.value = true;
    const res = await axios.get(`${import.meta.env.VITE_API}getProfileImages`, {
      params: { empid: empid() }
    });
    if (res.data.avatarImage) avatarImage.value = res.data.avatarImage;
    if (res.data.backgroundImage) profileBackgroundImage.value = res.data.backgroundImage;
  } catch (error) {
    console.log('Failed to load profile images:', error);
  } finally {
    loadingImages.value = false;
  }
};

const getUserProfile = async () => {
  loadingProfile.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}getHrisByNIK`, {
      params: { empid: empid() }
    });
    userProfile.value = res.data;
  } catch (error) {
    console.log('Failed to load user profile:', error);
  } finally {
    loadingProfile.value = false;
  }
};

const openProfileDrawer = async () => {
  profileDrawer.value = true;
  await getUserProfile();
};

/* const setListDomain = () => {
  listDomain.value = domains();
};
 */
const setDomain = async (value) => {
  spinnerBall();
  window.localStorage.setItem("domain", value.value);
  window.localStorage.setItem("unit", value.desc);
  Domain.value = value.value;
  const pattern = `${value.value} - `;
  Unit.value = value.desc.startsWith(pattern) ? value.desc.substring(pattern.length) : value.desc;
  await getMenuAksesUser();
  await getSite();
  setHeaderFooter();
  router.push("/");
  let timer = setTimeout(() => {
          $q.loading.hide()
          timer = void 0
  }, 1000) 
};

const setHeaderFooter = () => {
  if (Domain.value == 'WDJR'||Domain.value == 'WTUR'){
    // Header.value='tw-bg-[#003399]'
    Header.value=`tw-bg-[url('/bg/wdjr.svg')] tw-h-24`
    Footer.value='tw-bg-gradient-to-r tw-from-[#00b2e3] tw-to-[#231F20]'
  }else if (Domain.value == 'DJM' || Domain.value == 'DTU'){
    //Header.value='tw-bg-[#003b7b]'
    Header.value=`tw-bg-[url('/bg/djm.svg')] tw-h-24`
    Footer.value='tw-bg-[#231f20]'
  }else if (Domain.value == 'GBC'){
    //Header.value='tw-bg-[#ee4034]'
    Header.value=`tw-bg-[url('/bg/dbc.svg')] tw-h-24`
    Footer.value='tw-bg-gradient-to-r tw-from-[#BABCBE] tw-to-[#231F20]'
  }else if (Domain.value == 'RBG'){
    // Header.value='tw-bg-[#A8479A]'
    Header.value=`tw-bg-[url('/bg/rbg.svg')] tw-h-24`
    Footer.value='tw-bg-gradient-to-r tw-from-[#5BAF42] tw-to-[#231F20]'
  }else{
    //Header.value='tw-bg-[#ef4123]'
    Header.value=`tw-bg-[url('/bg/dbc.svg')] tw-h-24`
    Footer.value='tw-bg-gradient-to-r tw-from-[#4d5e6c] tw-to-[#1b323e]'
  }
}

const getSite = async () => {
 try{
     const res = await axios.get(`${import.meta.env.VITE_API}getUserSite`,{
        params: {
            domain:domain(),
            empid:empid(),
        }
    });
    window.localStorage.removeItem("ListSite");
    window.localStorage.setItem("ListSite", JSON.stringify(res.data));
 }catch(error){
      $q.notify({
      type: "negative",
      message: error,
    });
 }
};

const getMenuAksesUser = async () => {
  if (!empid() || !domain()) return;
  
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}getMenuAksesByUser`, {
      params: {
        empid: empid(),
        domain:domain(),
      },
    });

    listMenu.value = res.data.data;
  } catch (error) { 
    console.log(error.message);
  }
};

const logoutUser = async () => {
  try {
    spinnerBall();
    const res = await axios.post(`${import.meta.env.VITE_API}logout`, {
      params:{
        empid:empid(),
        note:'user',
        url:location.value.origin,
      }
    });
    $q.loading.hide()
    if (typeof res.data!== "undefined") {
      // Cookie auth dihapus di backend; bersihkan session (preferensi UI tetap).
      clearSession();
      window.sessionStorage.clear();
      redirectToLogin();
    }
  } catch (error) {
    console.log(error);
    $q.loading.hide()
   /*  $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  }
}


const logoutSystem = async () => {
  try {
    spinnerBall()
    const res = await axios.post(`${import.meta.env.VITE_API}logout`, {
      params:{
        empid:empid(),
        note:'system',
        url:location.value.origin,
      }
    });
    $q.loading.hide()
    if (typeof res.data!== "undefined") {
      // Cookie auth dihapus di backend; bersihkan session (preferensi UI tetap).
      clearSession();
      window.sessionStorage.clear();
      redirectToLogin();
    }
  } catch (error) {
    $q.loading.hide()
    console.log(error);
   /*  $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  }
}

//console.log(timeout.value);
const { start, stop } = useTimeoutFn(logoutSystem, timeout.value)

if (window.localStorage.getItem("menu")) {
  if (window.localStorage.getItem("menu") == "true") {
    menuType.value = true;
  } else {
    menuType.value = false;
  }
}

if (window.localStorage.getItem("dark")) {
  if (window.localStorage.getItem("dark") == "true") {
    menuType.value = true;

    $q.dark.set(true);
  } else {
    $q.dark.set(false);
  }
}

// Auth via httpOnly cookie (withCredentials di main.js) — tidak perlu set header Authorization.

//setListDomain();

/*
setInterval(() => {
  if (window.localStorage.getItem("token") !== null) {
    refreshToken();
  }
}, 120000);*/
setHeaderFooter();
onMounted(async() => {
  randomColor();
  await getMenuAksesUser();
  await getProfileImages();
});
  
const resetTimer = () => {
  stop()
  start()
}

window.addEventListener('mousemove', resetTimer)
window.addEventListener('keypress', resetTimer)
</script>

<style lang="scss" scoped>
@import './../assets/styles/main-layout.scss';
</style>

<style lang="sass">
@import './../assets/styles/main-layout.sass'
</style>

<style>
@import './../assets/styles/main-layout.css';
</style>
