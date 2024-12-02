<template>
  <aside>
    <transition name="cookie-control-container--transition">
      <div
        v-if="!isConsentGiven && !moduleOptions.isModalForced"
        class="cookie-control-container"
      >
        <div class="cookie-control-content">
          <div class="cookie-control-title">
            <slot name="bar">
              <p
                class="cookie-control-text"
                v-text="localeStrings?.bannerTitle"
              />
              <p
                class="cookie-control-description"
                v-text="localeStrings?.bannerDescription"
              />
            </slot>
          </div>
          <div class="button-bar">
            <button
              class="accept-button"
              type="button"
              @click="accept()"
              v-text="localeStrings?.acceptAll"
            />
            <a
              class="manage-cookies-button"
              @click="isModalActive = true"
              v-text="localeStrings?.manageCookies"
            />
          </div>
        </div>
      </div>
    </transition>
    <button
      v-if="moduleOptions.isControlButtonEnabled && isConsentGiven"
      aria-label="Cookie control"
      class="cookieControl__ControlButton"
      data-testid="nuxt-cookie-control-control-button"
      type="button"
      @click="isModalActive = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
        />
      </svg>
    </button>
    <transition name="cookieControl__Modal">
      <div
        v-if="isModalActive"
        class="cookieControl__Modal"
        @click.self="onModalClick"
      >
        <p
          v-if="isSaved"
          class="cookieControl__ModalUnsaved"
          v-text="localeStrings?.settingsUnsaved"
        />
        <div class="cookieControl__ModalContent">
          <div class="cookieControl__ModalContentInner">
            <h2 class="cookie-modal-heading">Nastavenie cookies</h2>
            <slot name="modal" />

            <div
              v-if="!moduleOptions.isModalForced"
              class="ModalLayout__close"
              @click="isModalActive = false"
            />

            <template v-for="cookieType in CookieType" :key="cookieType">
              <template v-if="moduleOptions.cookies[cookieType]?.length">
                <!-- <h2
                  v-text="
                    localeStrings &&
                    (cookieType === CookieType.NECESSARY
                      ? localeStrings.cookiesNecessary
                      : localeStrings.cookiesOptional)
                  "
                /> -->
                <ul>
                  <li
                    v-for="cookie in moduleOptions.cookies[cookieType]"
                    :key="cookie.id"
                  >
                    <slot name="cookie" v-bind="{ cookie }">
                      <div class="cookieControl__ModalInputWrapper">
                        <input
                          v-if="
                            cookieType === CookieType.NECESSARY &&
                            cookie.name !== 'functional'
                          "
                          :id="resolveTranslatable(cookie.name, props.locale)"
                          type="checkbox"
                          disabled
                          checked
                        />
                        <input
                          v-else
                          :id="resolveTranslatable(cookie.name, props.locale)"
                          type="checkbox"
                          :checked="
                            isConsentGiven === undefined
                              ? cookie.isPreselected
                              : getCookieIds(localCookiesEnabled).includes(
                                  cookie.id,
                                )
                          "
                          @change="toogleCookie(cookie)"
                        />
                        <button type="button" @click="toggleButton($event)">
                          {{ getName(cookie.name) }}
                        </button>
                        <label
                          class="cookieControl__ModalCookieName"
                          :for="resolveTranslatable(cookie.name, props.locale)"
                          tabindex="0"
                          @keydown="toggleLabel($event)"
                        >
                          {{ getName(cookie.name) }}
                          <span v-if="cookie.description">
                            {{ getDescription(cookie.description) }}
                          </span>
                          <span
                            v-if="
                              moduleOptions.isCookieIdVisible &&
                              cookie.targetCookieIds
                            "
                          >
                            <br />
                            {{
                              'IDs: ' +
                              cookie.targetCookieIds
                                .map((id) => `"${id}"`)
                                .join(', ')
                            }}
                          </span>
                          <template
                            v-if="Object.entries(cookie.links || {}).length"
                          >
                            <span
                              v-for="entry in Object.entries(
                                cookie.links || {},
                              )"
                              :key="entry[0]"
                            >
                              <br />
                              <NuxtLink
                                :to="entry[0]"
                                @click="
                                  !entry[0].toLowerCase().startsWith('http')
                                    ? (isModalActive = false)
                                    : null
                                "
                              >
                                {{ entry[1] || entry[0] }}
                              </NuxtLink>
                            </span>
                          </template>
                        </label>
                      </div>
                    </slot>
                  </li>
                </ul>
              </template>
            </template>
            <div class="cookie-modal-buttons">
              <button
                class="cookie-modal-accept-all-button"
                type="button"
                @click="
                  () => {
                    accept()
                    isModalActive = false
                  }
                "
                v-text="localeStrings?.acceptAll"
              />
              <button
                class="cookie-modal-save-button"
                type="button"
                @click="
                  () => {
                    acceptPartial()
                    isModalActive = false
                  }
                "
                v-text="localeStrings?.save"
              />

              <button
                v-if="!moduleOptions.isModalForced"
                class="cookie-modal-decline-all-button"
                type="button"
                @click="
                  () => {
                    declineAll()
                    isModalActive = false
                  }
                "
                v-text="localeStrings?.declineAll"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </aside>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue'
import {
  type Cookie,
  CookieType,
  type Locale,
  type Translatable,
} from '#cookie-control/types'
import {
  getAllCookieIdsString,
  getCookieIds,
  removeCookie,
  resolveTranslatable,
} from '#cookie-control/methods'
import { COOKIE_ID_SEPARATOR } from '#cookie-control/constants'
import setCssVariables from '#cookie-control/set-vars'
import { useCookieControl, useCookie, useNuxtApp } from '#imports'
export interface Props {
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
})
const {
  cookiesEnabled,
  cookiesEnabledIds,
  isConsentGiven,
  isModalActive,
  moduleOptions,
} = useCookieControl()
const nuxtApp = useNuxtApp()
// data
const expires = new Date(Date.now() + moduleOptions.cookieExpiryOffsetMs)
const localCookiesEnabled = ref([...(cookiesEnabled.value || [])])
const allCookieIdsString = getAllCookieIdsString(moduleOptions)
const cookieIsConsentGiven = useCookie(moduleOptions.cookieNameIsConsentGiven, {
  expires,
  ...moduleOptions.cookieOptions,
})
const cookieCookiesEnabledIds = useCookie(
  moduleOptions.cookieNameCookiesEnabledIds,
  {
    expires,
    ...moduleOptions.cookieOptions,
  },
)
// computations
const isSaved = computed(
  () =>
    getCookieIds(cookiesEnabled.value || [])
      .sort()
      .join(COOKIE_ID_SEPARATOR) !==
    getCookieIds(localCookiesEnabled.value).sort().join(COOKIE_ID_SEPARATOR),
)
const localeStrings = computed(() => moduleOptions.localeTexts[props.locale])
// methods
const accept = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies.optional,
  })
}
const acceptPartial = () => {
  const localCookiesEnabledIds = getCookieIds(localCookiesEnabled.value)
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: [
      ...moduleOptions.cookies.necessary,
      ...moduleOptions.cookies.optional,
    ].filter((cookie) => localCookiesEnabledIds.includes(cookie.id)),
  })
}
const decline = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies.necessary,
  })
}
const declineAll = () => {
  setCookies({
    isConsentGiven: false,
    cookiesOptionalEnabled: [],
  })
}
const getDescription = (description: Translatable) =>
  `${
    moduleOptions.isDashInDescriptionEnabled === false ? '' : '-'
  } ${resolveTranslatable(description, props.locale)}`
const getName = (name: Translatable) => {
  return resolveTranslatable(name, props.locale)
}
const init = () => {
  nuxtApp.$cookies.locale.value = props.locale
}
const onModalClick = () => {
  if (moduleOptions.closeModalOnClickOutside) {
    isModalActive.value = false
  }
}
const setCookies = ({
  cookiesOptionalEnabled: cookiesOptionalEnabledNew,
  isConsentGiven: isConsentGivenNew,
}: {
  cookiesOptionalEnabled: Cookie[]
  isConsentGiven: boolean
}) => {
  isConsentGiven.value = isConsentGivenNew // must come before an update to `cookiesEnabled`
  cookiesEnabled.value = isConsentGivenNew
    ? [
        ...moduleOptions.cookies.necessary,
        ...moduleOptions.cookies.optional.filter((cookieOptional: Cookie) =>
          cookiesOptionalEnabledNew.includes(cookieOptional),
        ),
      ]
    : []
  cookiesEnabledIds.value = isConsentGivenNew
    ? getCookieIds(cookiesEnabled.value)
    : []
}
const toggleButton = ($event: MouseEvent) => {
  ;(
    ($event.target as HTMLButtonElement | null)
      ?.nextSibling as HTMLLabelElement | null
  )?.click()
}
const toogleCookie = (cookie: Cookie) => {
  const cookieIndex = getCookieIds(localCookiesEnabled.value).indexOf(cookie.id)
  if (cookieIndex < 0) {
    localCookiesEnabled.value.push(cookie)
  } else {
    localCookiesEnabled.value.splice(cookieIndex, 1)
  }
}
const toggleLabel = ($event: KeyboardEvent) => {
  if ($event.key === ' ') ($event.target as HTMLLabelElement | null)?.click()
}
// lifecycle
onBeforeMount(() => {
  if (moduleOptions.colors) {
    const variables: Record<string, string> = {}
    for (const key in moduleOptions.colors) {
      variables[`cookie-control-${key}`] = `${moduleOptions.colors[key]}`
    }
    setCssVariables(variables)
  }
  if (moduleOptions.isModalForced && !isConsentGiven.value) {
    isModalActive.value = true
  }
})
watch(
  () => cookiesEnabled.value,
  (current, _previous) => {
    localCookiesEnabled.value = [...(current || [])]
    if (isConsentGiven.value) {
      cookieCookiesEnabledIds.value = getCookieIds(current || []).join(
        COOKIE_ID_SEPARATOR,
      )
      for (const cookieEnabled of current || []) {
        if (!cookieEnabled.src) continue
        const script = document.createElement('script')
        script.src = cookieEnabled.src
        const headElement = document.getElementsByTagName('head')[0]
        if (!headElement) return
        headElement.appendChild(script)
      }
    } else {
      cookieCookiesEnabledIds.value = undefined
    }
    // delete formerly enabled cookies that are now disabled
    const cookiesOptionalDisabled = moduleOptions.cookies.optional.filter(
      (cookieOptional) => !(current || []).includes(cookieOptional),
    )
    for (const cookieOptionalDisabled of cookiesOptionalDisabled) {
      if (!cookieOptionalDisabled.targetCookieIds) continue
      for (const cookieOptionalDisabledId of cookieOptionalDisabled.targetCookieIds) {
        removeCookie(cookieOptionalDisabledId)
      }
      if (cookieOptionalDisabled.src) {
        for (const script of [
          ...document.head.querySelectorAll(
            `script[src="${cookieOptionalDisabled.src}"]`,
          ),
        ]) {
          script.parentNode?.removeChild(script)
        }
      }
    }
  },
  { deep: true },
)
watch(isConsentGiven, (current, _previous) => {
  if (current === undefined) {
    cookieIsConsentGiven.value = undefined
  } else {
    cookieIsConsentGiven.value = current ? allCookieIdsString : '0'
  }
})
watch(
  () => props.locale,
  (locale) => {
    nuxtApp.$cookies.locale.value = locale
  },
)
// initialization
init()
defineExpose({
  accept,
  acceptPartial,
  decline,
})
</script>

<style scoped>
.cookie-control-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
  align-items: middle;
  width: 100%;
  background-color: #017275;
  @media (min-width: 640px) {
    padding-top: 4.5rem;
    padding-bottom: 4.5rem;
  }
}

.cookie-control-content {
  max-width: 1168px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  gap: 2rem;

  @media (min-width: 640px) {
    max-width: 640px;
  }
  @media (min-width: 768px) {
    max-width: 768px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
  @media (min-width: 1536px) {
    max-width: 1536px;
  }
  @media (min-width: 1920px) {
    max-width: 1920px;
  }
}

.cookie-control-title {
  margin: 0;
  @media (min-width: 768px) {
    grid-column: span 2 / span 2;
  }
}

.cookie-control-text {
  margin: 0;
  color: white;
  font-size: 1.125rem;
  line-height: 1.75rem;
  @media (min-width: 640px) {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

.cookie-control-description {
  color: white;
  margin-bottom: 0px;
}

.button-bar {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-self: center;
  @media (min-width: 640px) {
    flex-direction: row;
  }
  @media (min-width: 768px) {
    flex-direction: column;
  }
}

.accept-button {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 13rem;
  background-color: #0da947;
  padding: 0.375rem 2.25rem;
  color: white;
  min-height: 45px;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.9375rem;
  border-style: none;
  text-transform: uppercase;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  @media (min-width: 640px) {
    max-width: 12rem;
  }

  &:hover {
    background-color: #2f855a;
    transition: background-color 0.15s ease-in-out;
  }
}

.manage-cookies-button {
  width: 100%;
  padding: 1rem 0;
  text-align: center;
  color: white;

  &:hover {
    cursor: pointer;
  }
}

.cookie-modal-buttons {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
}

.cookie-modal-accept-all-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 41px;
  padding: 6px 20px;
  font-weight: 500;
  font-size: 0.9375rem;
  color: #fff;
  background-color: #05989b;
  border: 0 solid transparent;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  user-select: none;

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: #1bb5bc;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    background-color: #c5eced;
  }
}

.cookie-modal-save-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 41px;
  padding: 6px 20px;
  font-weight: 500;
  font-size: 0.9375rem;
  color: #017275;
  background-color: #ceeaeb;
  border: 0 solid transparent;
  border-radius: 6px;
  cursor: pointer;

  text-decoration: none;
  user-select: none;

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: #b7e0e1;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    background-color: #c5eced;
  }
}

.cookie-modal-decline-all-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 41px;
  padding: 6px 20px;
  font-weight: 500;
  font-size: 0.9375rem;
  color: #f22828;
  background-color: #fee2e2;
  border: 0 solid transparent;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  user-select: none;

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: #fecaca;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    background-color: #c5eced;
  }
}

.ModalLayout__close {
  background-color: #ececf1;
  position: absolute;
  z-index: 1;
  top: 1.25rem;
  right: 1.25rem;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  opacity: 1;

  font-size: 1.85rem;

  &::before {
    color: black;
    content: '\00d7';
    transform: translateY(-0.15rem);
  }

  &:hover {
    transition: opacity 0.15s ease-in-out;
    opacity: 0.4;
    cursor: pointer;
  }
}

.cookie-modal-heading {
  flex: 0 0 auto;
  padding: 1.25rem 4rem 0 0;
  font-size: 1.5rem;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 32px;
  }
}

button {
  border: none;
  outline: none;
}
/* TODO: cookieControl__Modal  rewrite; rewrite all styles  */

.cookieControl__ModalContent {
  border-radius: 0.375rem;
}
</style>
