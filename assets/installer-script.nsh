; -------------------------------------------------------------------
; Cortex — Safe NSIS extensions for electron-builder
; DO NOT redefine VERSION / PRODUCT_NAME / etc. (builder sets these)
; Use builder hooks: preInit, customInit, customInstall, customUnInstall
; -------------------------------------------------------------------

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"

; -------- Optional local defines (new names only) --------
!ifndef CORTEX_APP_NAME
  !define CORTEX_APP_NAME "Cortex"
!endif
!ifndef CORTEX_COMPANY
  !define CORTEX_COMPANY "ibexVision"
!endif
!ifndef CORTEX_SITE
  !define CORTEX_SITE "https://ibexvision.ai"
!endif

; ------------------ (UI customizations) -------------------
; These affect the stock pages that electron-builder inserts.
; (Don’t insert pages manually here; just set the defines.)

!define MUI_ABORTWARNING

!define MUI_WELCOMEPAGE_TITLE "Welcome to Cortex Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${CORTEX_APP_NAME}.$\r$\n$\r$\n${CORTEX_APP_NAME} is an advanced AI desktop application that brings powerful AI capabilities directly to your desktop.$\r$\n$\r$\nClick Next to continue."

!define MUI_FINISHPAGE_TITLE "Cortex Installation Complete"
!define MUI_FINISHPAGE_TEXT "${CORTEX_APP_NAME} has been successfully installed on your computer.$\r$\n$\r$\nClick Finish to start using ${CORTEX_APP_NAME}."

; Small helper to print log lines
!macro CORTEX_Log _msg
  DetailPrint "${_msg}"
!macroend

; -------------------- preInit -----------------------------
!macro preInit
  !insertmacro CORTEX_Log "preInit: ${CORTEX_APP_NAME} installer starting"
!macroend

; ------------------- customInit ---------------------------
!macro customInit
  ; Single-installer instance mutex
  System::Call 'kernel32::CreateMutexA(i 0, i 0, t "CortexInstallerMutex") i .r1 ?e'
  Pop $R0
  StrCmp $R0 0 +3
    MessageBox MB_OK|MB_ICONEXCLAMATION "The installer is already running."
    Abort

  ; Require Windows 10+
  ${IfNot} ${AtLeastWin10}
    MessageBox MB_OK|MB_ICONSTOP "This application requires Windows 10 or later."
    Abort
  ${EndIf}

  !insertmacro CORTEX_Log "customInit: environment OK (Win10+)"
!macroend

; ------------------ customInstall -------------------------
!macro customInstall
  !insertmacro CORTEX_Log "customInstall: post-install tasks"
  ; (Keep light; builder handles registry, shortcuts, uninstaller, etc.)
!macroend

; ---------------- customUnInstall -------------------------
!macro customUnInstall
  !insertmacro CORTEX_Log "customUnInstall: running clean-up"
!macroend
