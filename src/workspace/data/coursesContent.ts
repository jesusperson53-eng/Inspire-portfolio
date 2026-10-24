import { CourseEntity } from '../types/learning';

export const coursesContent: CourseEntity[] = [
  {
    id: 'c1',
    title: 'Computer Course',
    description: 'Fundamentals, hardware, system maintenance, OS, and practical shortcuts.',
    icon: 'Monitor',
    color: 'bg-blue-500',
    chapters: [
      {
        id: 'c1_m1',
        title: 'Module 1: Fundamentals of Computing',
        topics: [
          {
            id: 'c1_m1_t1',
            title: 'Information Processing Cycle',
            content: `### The Information Processing Cycle
The Information Processing Cycle is the sequence of events that a computer uses to process data into meaningful information. It consists of four main stages:
* **Input:** Entering data into the computer. This is done using input devices like a keyboard, mouse, or microphone.
* **Process:** The computer manipulates the data to create information. The Central Processing Unit (CPU) handles this stage.
* **Output:** Presenting the processed information to the user. This is done using output devices like a monitor, printer, or speakers.
* **Storage:** Saving the data or information for future use. This is done using storage devices like a hard disk drive (HDD) or solid-state drive (SSD).

**Example:** When you type a document (Input), the computer processes your keystrokes (Process), displays the text on the screen (Output), and saves the file to your hard drive (Storage).`
          },
          {
            id: 'c1_m1_t2',
            title: 'Types of Software',
            content: `### Understanding Software Types
Software is a set of instructions that tells the computer hardware what to do. There are two main categories:

#### 1. System Software
System software manages the computer's hardware and provides a platform for running application software.
* **Operating Systems (OS):** The most important system software. It manages memory, processes, and all software and hardware. Examples: Windows, macOS, Linux, Android, iOS.
* **Utility Software:** Helps maintain, analyze, configure, and optimize the computer. Examples: Antivirus programs, disk defragmenters, backup software.

#### 2. Application Software
Application software is designed to help the user perform specific tasks.
* **Word Processors:** Used for creating text documents. Example: Microsoft Word, Google Docs.
* **Web Browsers:** Used for accessing the internet. Example: Google Chrome, Mozilla Firefox.
* **Media Players:** Used for playing audio and video files. Example: VLC Media Player, Windows Media Player.
* **Games:** Entertainment software.`
          }
        ]
      },
      {
        id: 'c1_m2',
        title: 'Module 2: Hardware & Internal Components',
        topics: [
          {
            id: 'c1_m2_t1',
            title: 'Input & Output Devices',
            content: `### Input & Output Devices
Hardware refers to the physical components of a computer system.

#### Input Devices
These devices allow you to enter data and instructions into a computer.
* **Keyboard:** Used for typing text and entering commands.
* **Mouse:** A pointing device used to interact with graphical user interfaces (GUIs).
* **Scanner:** Converts physical documents or images into digital format.
* **Microphone:** Used to input audio data.
* **Webcam:** Captures video input.

#### Output Devices
These devices present the processed information from the computer.
* **Monitor:** Displays visual output, such as text, images, and video.
* **Printer:** Produces a hard copy of digital documents or images.
* **Speakers:** Output audio data.
* **Headphones:** Similar to speakers, but for personal listening.
* **Projector:** Projects visual output onto a large screen or wall.`
          },
          {
            id: 'c1_m2_t2',
            title: 'CPU & Motherboard',
            content: `### The Brain and the Backbone
#### Central Processing Unit (CPU)
The CPU is the "brain" of the computer. It performs most of the processing inside the computer.
* **Role:** Executes instructions from software programs.
* **Cores:** A core is an individual processing unit within the CPU. Multi-core processors (e.g., dual-core, quad-core) can handle multiple tasks simultaneously.
* **Threads:** A thread is a sequence of instructions that can be executed independently. Multi-threading allows a single core to handle multiple threads, improving performance.

#### Motherboard
The motherboard is the main circuit board of the computer. It connects all the components together.
* **Architecture:** It provides the physical and electrical connections for the CPU, memory, storage, and expansion cards.
* **Buses:** Pathways that transfer data between components.
* **Sockets:** Connectors where the CPU is installed.
* **Expansion Slots:** Slots for adding additional components, such as graphics cards or sound cards.`
          },
          {
            id: 'c1_m2_t3',
            title: 'Memory: RAM vs ROM',
            content: `### Understanding Computer Memory
#### Random Access Memory (RAM)
RAM is the computer's short-term memory. It stores data that the CPU needs quick access to.
* **Volatile:** Data is lost when the computer is turned off.
* **Capacity:** Measured in Gigabytes (GB). More RAM allows the computer to run more programs simultaneously without slowing down.
* **Use-case:** Running applications, opening files, browsing the web.

#### Read-Only Memory (ROM)
ROM is non-volatile memory that stores essential system instructions.
* **Non-volatile:** Data is retained even when the computer is turned off.
* **Capacity:** Much smaller than RAM, typically measured in Megabytes (MB).
* **Use-case:** Storing the BIOS (Basic Input/Output System) or UEFI, which initializes hardware during the boot process.`
          },
          {
            id: 'c1_m2_t4',
            title: 'Storage Devices',
            content: `### Long-Term Data Storage
Storage devices are used to save data permanently.

#### Types of Storage
* **Hard Disk Drive (HDD):** Uses magnetic platters to store data. Slower but offers large capacities at a lower cost.
* **Solid-State Drive (SSD):** Uses flash memory to store data. Much faster than HDDs, more durable, but typically more expensive per gigabyte.
* **Flash Drives (USB Drives):** Portable storage devices that use flash memory.
* **Optical Drives:** Use lasers to read/write data on CDs, DVDs, or Blu-ray discs.

#### The Storage Hierarchy
1. **Cache Memory:** Fastest, smallest capacity, located inside or very close to the CPU.
2. **RAM (Main Memory):** Fast, medium capacity, volatile.
3. **Solid-State Drives (SSDs):** Slower than RAM, large capacity, non-volatile.
4. **Hard Disk Drives (HDDs):** Slower than SSDs, very large capacity, non-volatile.
5. **Archival Storage (Tape Drives):** Slowest, massive capacity, used for long-term backups.`
          }
        ]
      },
      {
        id: 'c1_m3',
        title: 'Module 3: System Management & Maintenance',
        topics: [
          {
            id: 'c1_m3_t1',
            title: 'Software Installation',
            content: `### Managing Software
#### Installing Software
1. **Download:** Obtain the installer file (usually .exe or .msi on Windows) from a trusted source.
2. **Verify:** Check the publisher's digital signature to ensure the software is authentic and hasn't been tampered with.
3. **Run Installer:** Double-click the installer file and follow the on-screen prompts. Pay attention to installation options and avoid installing unwanted bundled software.

#### Uninstalling Software
* **Windows Settings:** Go to Settings > Apps > Apps & features. Find the app, click it, and select "Uninstall".
* **Control Panel:** Go to Control Panel > Programs > Programs and Features. Select the program and click "Uninstall".
* **Third-Party Uninstallers:** Tools like Revo Uninstaller can remove leftover files and registry entries that standard uninstallers might miss.`
          },
          {
            id: 'c1_m3_t2',
            title: 'Driver Installation',
            content: `### Keeping Hardware Running Smoothly
Drivers are software that allows the operating system to communicate with hardware devices.

#### Installing and Updating Drivers
* **Windows Update:** The easiest way to get driver updates for most hardware.
* **Device Manager:** Right-click the Start button and select "Device Manager". Right-click a device and select "Update driver".
* **Manufacturer Websites:** For graphics cards (NVIDIA, AMD) or specific peripherals, download the latest drivers directly from the manufacturer's website.

#### Rolling Back Drivers
If a new driver causes issues (e.g., crashes, poor performance), you can revert to the previous version.
1. Open Device Manager.
2. Right-click the problematic device and select "Properties".
3. Go to the "Driver" tab.
4. Click "Roll Back Driver" and follow the prompts.`
          },
          {
            id: 'c1_m3_t3',
            title: 'Drive Management',
            content: `### Organizing Your Storage
#### Partitions
A partition is a logical division of a physical storage drive. It allows you to treat one physical drive as multiple separate drives (e.g., C: drive for Windows, D: drive for data).
* **Creating Partitions:** Use the "Disk Management" tool in Windows. Right-click "Unallocated space" and select "New Simple Volume".
* **Formatting:** Preparing a partition for use by creating a file system.

#### File Systems
* **NTFS (New Technology File System):** The standard file system for Windows system drives. Supports large files and advanced security features.
* **exFAT (Extensible File Allocation Table):** Optimized for flash drives. Compatible with both Windows and macOS, and supports files larger than 4GB.
* **FAT32:** Older file system, highly compatible but limited to 4GB maximum file size.

#### Drive Letters
Windows assigns letters (C:, D:, E:, etc.) to identify different drives and partitions.`
          },
          {
            id: 'c1_m3_t4',
            title: 'Disk Cleanup & Task Manager',
            content: `### System Optimization Tools
#### Disk Cleanup
A built-in Windows tool that frees up space on your hard drive by deleting temporary files, system cache, and other unnecessary data.
* **How to use:** Search for "Disk Cleanup" in the Start menu, select the drive you want to clean, and check the boxes for the file types you want to delete.

#### Defragmentation (HDDs only)
Over time, files on a hard disk drive can become fragmented (stored in non-contiguous blocks), slowing down read/write speeds. Defragmentation reorganizes these files.
* **Note:** Do not defragment Solid-State Drives (SSDs), as it reduces their lifespan and provides no performance benefit. Windows automatically optimizes SSDs using the TRIM command.

#### Task Manager
A powerful tool for monitoring system performance and managing running processes.
* **How to open:** Press Ctrl + Shift + Esc, or right-click the taskbar and select "Task Manager".
* **Processes Tab:** Shows running apps and background processes, and their resource usage (CPU, Memory, Disk, Network).
* **Performance Tab:** Provides real-time graphs of resource utilization. Useful for identifying bottlenecks.`
          }
        ]
      },
      {
        id: 'c1_m4',
        title: 'Module 4: Operating Systems & Advanced Tools',
        topics: [
          {
            id: 'c1_m4_t1',
            title: 'Create Bootable Drive',
            content: `### Preparing for OS Installation
A bootable drive (usually a USB flash drive) contains the installation files for an operating system and allows you to boot the computer from it.

#### Steps to Create a Bootable Windows USB Drive
1. **Download the ISO:** Obtain the Windows ISO file from the official Microsoft website. Alternatively, use the Windows Media Creation Tool, which handles downloading and creating the drive automatically.
2. **Use Rufus (Optional):** Rufus is a popular third-party tool for creating bootable USB drives from ISO files.
3. **Select Partition Scheme:** When using Rufus, you must select the correct partition scheme for your computer's firmware:
   * **GPT (GUID Partition Table):** For modern computers with UEFI firmware.
   * **MBR (Master Boot Record):** For older computers with Legacy BIOS firmware.
4. **Format and Create:** The tool will format the USB drive (erasing all existing data) and copy the installation files.`
          },
          {
            id: 'c1_m4_t2',
            title: 'System Locking & Unlocking',
            content: `### Securing Your Computer
#### User Accounts
Create separate user accounts for different people using the computer.
* **Administrator:** Has full control over the system, can install software and change settings.
* **Standard User:** Can use most software but cannot make system-wide changes.

#### Authentication Methods
* **Strong Passwords:** Use a mix of uppercase/lowercase letters, numbers, and symbols.
* **PINs:** A shorter, numeric code that is often more convenient than a password, especially when combined with a TPM (Trusted Platform Module).
* **Biometrics:** Windows Hello supports fingerprint readers and facial recognition cameras for quick and secure login.

#### BitLocker Drive Encryption
A Windows Pro/Enterprise feature that encrypts the entire contents of a drive, protecting data if the computer is lost or stolen.
* **How it works:** Requires a password, smart card, or TPM to unlock the drive during boot.`
          },
          {
            id: 'c1_m4_t3',
            title: 'Windows Installation Procedure',
            content: `### Installing Windows from Scratch
#### Step-by-Step Guide
1. **Boot Order:** Access your computer's BIOS/UEFI settings (usually by pressing F2, F12, Delete, or Esc during startup) and change the boot order to prioritize the USB drive.
2. **Start Installation:** Boot from the USB drive and follow the initial prompts (language, time format, keyboard layout).
3. **Enter Product Key:** Enter your Windows product key, or select "I don't have a product key" to activate later.
4. **Select Edition:** Choose the correct Windows edition (e.g., Home, Pro).
5. **Installation Type:** Select "Custom: Install Windows only (advanced)" for a clean installation.
6. **Partition Selection:** Select the drive where you want to install Windows. You may need to delete existing partitions to create unallocated space.
7. **Installation:** Windows will copy files and install features. The computer will restart several times.
8. **Out-of-Box Experience (OOBE):** Follow the prompts to set up your region, keyboard, network connection, and user account.
9. **Post-Install:** Install necessary drivers (graphics, network, chipset) and run Windows Update to get the latest security patches.`
          }
        ]
      },
      {
        id: 'c1_m5',
        title: 'Module 5: Practical Skills & Shortcuts',
        topics: [
          {
            id: 'c1_m5_t1',
            title: 'Typing Fundamentals',
            content: `### Mastering the Keyboard
#### Touch Typing Basics
Touch typing is the ability to type without looking at the keyboard, relying on muscle memory.
* **Home Row:** The central row of keys (A, S, D, F, J, K, L, ;). Your fingers should rest here when not typing.
* **Finger Placement:**
  * Left hand: Pinky on A, Ring on S, Middle on D, Index on F.
  * Right hand: Index on J, Middle on K, Ring on L, Pinky on ;.
  * Thumbs rest on the Spacebar.
* **Posture:** Sit up straight, feet flat on the floor, wrists slightly elevated above the keyboard.
* **Accuracy First:** Focus on hitting the correct keys rather than typing fast. Speed will come naturally with practice.

#### Urdu Typing Techniques
* **Phonetic Keyboard:** The most common layout for Urdu typing. Keys are mapped to English letters with similar sounds (e.g., 'A' for Alif, 'B' for Bay).
* **Practice:** Use online typing tutors or software specifically designed for Urdu typing to build muscle memory.`
          },
          {
            id: 'c1_m5_t2',
            title: 'Top 30 Essential Shortcut Keys',
            content: `### Boost Your Productivity
#### Core Editing
* **Ctrl + C:** Copy selected item.
* **Ctrl + X:** Cut selected item.
* **Ctrl + V:** Paste copied or cut item.
* **Ctrl + Z:** Undo previous action.
* **Ctrl + Y:** Redo undone action.
* **Ctrl + A:** Select all items in a document or window.
* **Ctrl + F:** Find text within a document or web page.
* **Ctrl + S:** Save the current document.
* **Ctrl + P:** Print the current document.

#### Window & System Management
* **Alt + Tab:** Switch between open applications.
* **Windows Key + D:** Show or hide the desktop.
* **Windows Key + L:** Lock your computer.
* **Windows Key + E:** Open File Explorer.
* **Windows Key + I:** Open Windows Settings.
* **Windows Key + R:** Open the Run dialog box.
* **Ctrl + Shift + Esc:** Open Task Manager directly.
* **Alt + F4:** Close the active item, or exit the active app.

#### Browser & Navigation
* **Ctrl + T:** Open a new tab.
* **Ctrl + W:** Close the current tab.
* **Ctrl + Shift + T:** Reopen the last closed tab.
* **Ctrl + Tab:** Switch to the next tab.
* **Ctrl + Shift + Tab:** Switch to the previous tab.
* **Ctrl + L:** Select the address bar.
* **F5 or Ctrl + R:** Refresh the current page.

#### Productivity & Screenshots
* **PrtScn (Print Screen):** Take a screenshot of the entire screen and copy it to the clipboard.
* **Windows Key + Shift + S:** Open the Snipping Tool to capture a specific area of the screen.
* **Windows Key + V:** Open the Clipboard history (must be enabled in settings).
* **Ctrl + Arrow Keys:** Move the cursor one word at a time.
* **Shift + Arrow Keys:** Select text.
* **Ctrl + Backspace:** Delete an entire word.`
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'MS Office Course',
    description: 'Foundational and intermediate skills in Word, PowerPoint, and Excel.',
    icon: 'FileText',
    color: 'bg-indigo-500',
    chapters: [
      {
        id: 'c2_m1',
        title: 'Module 1: Microsoft Word',
        topics: [
          {
            id: 'c2_m1_t1',
            title: 'Introduction & Interface',
            content: `### Mastering the Word Interface
Microsoft Word is a powerful word processing application used for creating documents.

#### The Ribbon & Tabs
The Ribbon is the command center, organized into tabs:
* **Home Tab:** Contains the most frequently used commands for formatting text (font, size, color, bold, italics), paragraph alignment, and styles.
* **Insert Tab:** Used to add elements to your document, such as tables, pictures, shapes, charts, headers/footers, and page numbers.
* **Design Tab:** Controls the overall look of the document with themes, page colors, and watermarks.
* **Layout Tab:** Manages page setup, including margins, orientation (portrait/landscape), size, and columns.
* **References Tab:** Essential for academic writing (table of contents, citations, bibliography).

#### The Format Panel
When you select an object (like a picture or shape), a contextual Format tab appears, offering specific tools for that object (e.g., cropping, borders, effects).`
          },
          {
            id: 'c2_m1_t2',
            title: 'Practical Projects',
            content: `### Applying Word Skills
#### Project 1: CV (Resume) Creation
1. **Setup:** Set margins to 'Narrow' to maximize space.
2. **Structure:** Use a Table (with hidden borders) to create a clean, two-column layout (e.g., contact info on the left, experience on the right).
3. **Styling:** Use 'Heading 1' for your name, 'Heading 2' for section titles (Experience, Education). Modify the Styles to ensure consistency.
4. **Bullet Points:** Use bulleted lists for detailing job responsibilities.

#### Project 2: Certificate Designing
1. **Orientation:** Change Page Orientation to 'Landscape'.
2. **Borders:** Go to Design > Page Borders. Choose an elegant art border or a thick line style.
3. **Typography:** Use WordArt for the main title (e.g., "Certificate of Achievement"). Use formal serif or script fonts.
4. **Shapes:** Insert lines for signatures and use shapes (like ribbons or stars) for decoration.`
          }
        ]
      },
      {
        id: 'c2_m2',
        title: 'Module 2: PowerPoint',
        topics: [
          {
            id: 'c2_m2_t1',
            title: 'Basics & Core Features',
            content: `### Creating Engaging Presentations
PowerPoint is designed for visual storytelling.

#### Design & Themes
* **Themes:** Apply a consistent design (colors, fonts, backgrounds) across all slides from the Design tab.
* **Slide Master:** View > Slide Master. Edit the master slide to make global changes (e.g., adding a logo to every slide).
* **Layouts:** Use built-in slide layouts (Title Slide, Title and Content, Two Content) to structure information quickly.

#### Insert & Media
* **Images & Icons:** High-quality visuals are crucial. Use the Insert tab to add pictures, stock images, or scalable vector icons.
* **SmartArt:** Convert bullet points into visual diagrams (processes, hierarchies, cycles) with a few clicks.
* **Charts:** Insert charts (pie, bar, line) linked to Excel data to present statistics clearly.`
          },
          {
            id: 'c2_m2_t2',
            title: 'Transitions & Animations',
            content: `### Adding Motion to Presentations
#### Transitions
Transitions control how one slide moves to the next.
* **Subtle vs. Exciting:** Use subtle transitions (Fade, Push) for professional settings. Avoid overly flashy transitions unless appropriate for the context.
* **Timing:** Set the duration of the transition and choose whether it advances on a mouse click or automatically after a set time.

#### Animations
Animations control how individual elements (text, images) appear on a single slide.
* **Types:** Entrance (how it appears), Emphasis (drawing attention to it), Exit (how it disappears), and Motion Paths.
* **Animation Pane:** Use this tool to manage multiple animations on a slide, controlling their order, timing, and triggers (e.g., "Start With Previous").

#### Slide Show Settings
* **Rehearse Timings:** Practice your presentation while PowerPoint records the time spent on each slide.
* **Presenter View:** A dual-monitor setup where the audience sees the slides, and you see your notes, the current slide, and the upcoming slide.`
          }
        ]
      },
      {
        id: 'c2_m3',
        title: 'Module 3: Excel',
        topics: [
          {
            id: 'c2_m3_t1',
            title: 'Fundamentals & Workbook Design',
            content: `### Mastering Spreadsheets
#### Workbooks vs. Worksheets
* **Workbook:** The entire Excel file (.xlsx).
* **Worksheet:** Individual tabs within the workbook (Sheet1, Sheet2).

#### Data Organization
* **Tables:** Convert a range of data into an Excel Table (Ctrl+T). This provides automatic filtering, sorting, and dynamic ranges for formulas.
* **Named Ranges:** Assign a readable name to a cell or range (e.g., naming cell B2 "TaxRate"). This makes formulas much easier to read (e.g., \`=Price * TaxRate\`).

#### Formatting
* **Conditional Formatting:** Automatically change the appearance of cells based on their value (e.g., highlighting sales over $1000 in green).
* **Cell Referencing:**
  * **Relative:** \`A1\` (Changes when copied to another cell).
  * **Absolute:** \`$A$1\` (Stays locked to cell A1 when copied).`
          },
          {
            id: 'c2_m3_t2',
            title: 'Key Formulas',
            content: `### Essential Excel Functions
Formulas always start with an equals sign (\`=\`).

#### Arithmetic & Statistics
* **SUM:** Adds a range of numbers. \`=SUM(A1:A10)\`
* **AVERAGE:** Calculates the mean. \`=AVERAGE(B1:B20)\`
* **MAX / MIN:** Finds the highest or lowest value in a range. \`=MAX(C1:C50)\`
* **COUNT / COUNTA:** COUNT counts cells with numbers; COUNTA counts non-empty cells.

#### Text Functions
* **PROPER:** Capitalizes the first letter of each word. \`=PROPER("john doe")\` -> "John Doe"
* **CONCATENATE (or TEXTJOIN):** Combines text from multiple cells. \`=CONCATENATE(A1, " ", B1)\`

#### Logical & Lookup Functions
* **IF:** Performs a logical test. \`=IF(A1>50, "Pass", "Fail")\`
* **SUMIF:** Adds cells that meet a specific condition. \`=SUMIF(Range, Criteria, Sum_Range)\`
* **VLOOKUP:** Searches for a value in the first column of a table and returns a value in the same row from another column. \`=VLOOKUP(Lookup_Value, Table_Array, Col_Index_Num, FALSE)\``
          },
          {
            id: 'c2_m3_t3',
            title: 'Practical Sheets',
            content: `### Building Real-World Tools
#### 1. Expense Report
* **Structure:** Columns for Date, Category (Dropdown list using Data Validation), Description, and Amount.
* **Formulas:** Use \`SUMIF\` to calculate total expenses per category. Use Conditional Formatting to highlight high expenses.

#### 2. Student Results Card
* **Structure:** Columns for Student Name, Subject Scores, Total, Percentage, and Grade.
* **Formulas:** Use \`SUM\` for the total, simple division for percentage. Use nested \`IF\` statements to assign grades (e.g., \`=IF(P2>=90,"A", IF(P2>=80,"B","C"))\`).

#### 3. Inventory Management
* **Structure:** Item ID, Item Name, Quantity in Stock, Reorder Level.
* **Formulas:** Use Conditional Formatting to turn the "Quantity" cell red if it drops below the "Reorder Level". Use \`VLOOKUP\` to pull item details into an invoice sheet.`
          }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Graphic Design (Photoshop)',
    description: 'Adobe Photoshop fundamentals for social graphics and retouched images.',
    icon: 'Image',
    color: 'bg-purple-500',
    chapters: [
      {
        id: 'c3_m1',
        title: 'Module 1-3: Basics & Selections',
        topics: [
          {
            id: 'c3_m1_t1',
            title: 'Intro & Workspace',
            content: `### Getting Started with Photoshop
#### What is Graphic Design?
Graphic design is the art of communicating ideas visually using typography, imagery, and layout. Photoshop is the industry standard for raster (pixel-based) image editing.

#### Interface Overview
* **Menu Bar:** Top of the screen (File, Edit, Image, Layer, etc.).
* **Options Bar:** Just below the Menu Bar; changes based on the tool selected.
* **Toolbar:** Usually on the left; contains all the tools for selecting, painting, and editing.
* **Panels:** Usually on the right (Layers, Properties, Color). These can be docked or floating.

#### Workspace Customization
* **Resetting:** If you lose a panel, go to Window > Workspace > Reset Essentials.
* **Saving:** Once you arrange panels to your liking, save it: Window > Workspace > New Workspace.`
          },
          {
            id: 'c3_m1_t2',
            title: 'Selection & Manipulation',
            content: `### Mastering Selections
Selections allow you to edit specific parts of an image without affecting the rest.

#### Basic Navigation
* **Zoom:** Alt + Scroll Wheel (or Ctrl + / Ctrl -).
* **Pan:** Hold Spacebar and click-drag.

#### Manual Selections
* **Marquee Tools:** Rectangular or Elliptical selections.
* **Lasso Tools:** Freehand, Polygonal (straight lines), Magnetic (snaps to edges).

#### Smart Selections
* **Magic Wand:** Selects areas of similar color with one click. Adjust 'Tolerance' to select more or less.
* **Quick Selection Tool:** "Paints" a selection by finding edges automatically.
* **Object Selection Tool:** Draw a box around an object, and AI selects it.

#### Select & Mask
A dedicated workspace for refining selections, especially tricky edges like hair. Use the Refine Edge Brush Tool here.

#### Background Removal
1. Select the subject using the Object Selection Tool.
2. Add a Layer Mask (the rectangle with a circle icon at the bottom of the Layers panel). This hides the background non-destructively.`
          },
          {
            id: 'c3_m1_t3',
            title: 'Layer Management',
            content: `### The Power of Layers
Layers are like stacked sheets of transparent glass.

#### Layer Concepts
* **Stacking Order:** The layer at the top of the panel appears in front of the layers below it.
* **Visibility:** Click the eye icon next to a layer to hide/show it.
* **Locking:** Lock layers to prevent accidental edits.

#### Transparency & Blending
* **Opacity:** Controls how transparent the entire layer is (0% is invisible, 100% is solid).
* **Fill:** Similar to Opacity, but doesn't affect Layer Styles (like drop shadows).
* **Blending Modes:** Change how a layer interacts with the layers below it (e.g., Multiply darkens, Screen lightens, Overlay adds contrast).

#### Adjustment Layers
Non-destructive layers that apply color and tonal adjustments to the layers below them without permanently changing the original pixels.`
          }
        ]
      },
      {
        id: 'c3_m2',
        title: 'Module 4-6: Editing & Typography',
        topics: [
          {
            id: 'c3_m2_t1',
            title: 'Image Editing & Retouching',
            content: `### Perfecting Images
#### Healing Tools
* **Spot Healing Brush:** Automatically samples surrounding pixels to remove blemishes or small spots. Just click and drag over the spot.
* **Healing Brush:** Requires you to manually define a source point (Alt-click) before painting over the blemish.
* **Patch Tool:** Select an area to replace, then drag the selection to a clean area to sample from.

#### Clone Stamp Tool
Paints with a sample of an image. Alt-click to set the source point, then paint to duplicate that area elsewhere. Great for removing larger objects or extending backgrounds.

#### Content-Aware Fill
Select an object you want to remove, go to Edit > Content-Aware Fill. Photoshop uses AI to analyze the surrounding area and seamlessly fill the gap.`
          },
          {
            id: 'c3_m2_t2',
            title: 'Colors & Effects',
            content: `### Color Correction and Grading
Use Adjustment Layers for all color work to remain non-destructive.

#### Brightness & Contrast
Simple adjustments to make an image lighter/darker or increase/decrease the difference between light and dark areas.

#### Hue & Saturation
* **Hue:** Changes the actual color.
* **Saturation:** Changes the intensity of the color (from gray to vibrant).
* **Lightness:** Makes the color lighter or darker.
* *Tip:* You can target specific color channels (e.g., only adjust the Reds).

#### Color Correction vs. Grading
* **Correction:** Fixing issues to make the image look natural (adjusting white balance, fixing exposure).
* **Grading:** Applying a creative style or mood (e.g., making a scene look cold and blue, or warm and cinematic).`
          },
          {
            id: 'c3_m2_t3',
            title: 'Typography & Text',
            content: `### Designing with Type
#### Type Tool Basics
* **Point Text:** Click once to start typing. Good for short titles.
* **Paragraph Text:** Click and drag to create a text box. Good for body copy; text wraps automatically.

#### Professional Font Selection
* **Serif:** Fonts with small decorative lines at the ends of strokes (e.g., Times New Roman, Garamond). Traditional, elegant.
* **Sans-Serif:** Fonts without those lines (e.g., Helvetica, Arial, Montserrat). Modern, clean.
* **Pairing:** A common rule is to pair a bold Sans-Serif for headings with a readable Serif or lighter Sans-Serif for body text.

#### Text Styling
Use the Character and Paragraph panels (Window > Character/Paragraph) to adjust:
* **Tracking:** Spacing between all letters in a word.
* **Kerning:** Spacing between two specific letters.
* **Leading:** Vertical spacing between lines of text.`
          }
        ]
      },
      {
        id: 'c3_m3',
        title: 'Module 7-9: Vectors & Exporting',
        topics: [
          {
            id: 'c3_m3_t1',
            title: 'Shapes & Layouts',
            content: `### Structure and Composition
#### Shape Tools
Photoshop isn't just for pixels; it handles vector shapes too.
* **Tools:** Rectangle, Ellipse, Polygon, Custom Shape.
* **Fill & Stroke:** Shapes have a Fill (inside color) and a Stroke (outline color/thickness). These can be changed at any time without losing quality.

#### Layouts & Composition
* **Rule of Thirds:** Divide your canvas into a 3x3 grid. Place key elements along the lines or at the intersections.
* **Alignment:** Use the alignment tools in the Options bar (when the Move tool is selected) to perfectly center or align multiple layers.
* **White Space:** Don't fill every inch of the canvas. Empty space helps the design breathe and guides the viewer's eye.`
          },
          {
            id: 'c3_m3_t2',
            title: 'Mini Practical Projects',
            content: `### Putting It Together
#### 1. Social Media Post (Instagram Square)
* **Size:** 1080x1080 pixels.
* **Task:** Create a promotional post. Use a high-quality background image, apply a dark gradient overlay (so text is readable), and add a bold headline and a Call to Action (CTA) button using shape tools.

#### 2. YouTube Thumbnail
* **Size:** 1280x720 pixels.
* **Task:** Create a high-click-through thumbnail. Cut out a subject using Select & Mask, add a bright stroke around them, use a vibrant background, and add large, high-contrast text (max 3-4 words).

#### 3. Simple Poster
* **Size:** A4 or 8.5x11 inches (300 DPI for print).
* **Task:** Design an event poster. Focus on visual hierarchy: The event name should be the largest, followed by the date/time, and then location details.`
          },
          {
            id: 'c3_m3_t3',
            title: 'Finalizing & Exporting',
            content: `### Saving Your Work
#### Image Size & Resolution
* **Pixels:** Used for digital screens (e.g., 1920x1080). Resolution (DPI/PPI) doesn't matter for screens, only the pixel dimensions.
* **DPI (Dots Per Inch):** Crucial for print. Standard print resolution is 300 DPI.

#### Saving Formats
* **PSD (Photoshop Document):** Always save a PSD. It keeps all your layers, masks, and text editable.
* **JPG/JPEG:** Best for photographs. Compresses file size but loses some quality (lossy). Does not support transparency.
* **PNG:** Best for graphics, logos, and images with text. Supports transparency. Larger file size than JPG.

#### Exporting for Web/Social
Go to File > Export > Export As...
* Choose JPG or PNG.
* Adjust quality to balance file size and visual fidelity.
* Ensure "Convert to sRGB" is checked so colors look correct on all web browsers.`
          }
        ]
      }
    ]
  },
  {
    id: 'c4',
    title: 'CapCut Video Editing',
    description: 'From beginner to professional video editing using CapCut.',
    icon: 'Video',
    color: 'bg-red-500',
    chapters: [
      {
        id: 'c4_m1',
        title: 'Module 1-2: Foundations & Interface',
        topics: [
          {
            id: 'c4_m1_t1',
            title: 'What is Video Editing?',
            content: `### The Art of the Cut
#### Storytelling Drives Editing
Video editing is not just about putting clips together; it's about telling a story, conveying an emotion, or delivering information effectively. Every cut should have a purpose.

#### Raw vs. Edited
* **Raw Footage:** Unedited, direct from the camera. Often contains mistakes, long pauses, and poor lighting/audio.
* **Edited Video:** The final product, where the best takes are selected, color is corrected, audio is mixed, and graphics are added.

#### Types of Editing
* **Manual Editing:** The traditional approach. You make every cut, transition, and adjustment yourself. Offers the most control.
* **AI-Assisted Editing:** Using AI tools to speed up the process (e.g., auto-captions, auto-reframe, removing silences).
* **Automated Editing:** Using templates or software that completely edits the video for you based on selected clips and music. Good for quick social posts, but lacks creative control.`
          },
          {
            id: 'c4_m1_t2',
            title: 'CapCut Setup',
            content: `### Getting Started with CapCut
#### Installation & Login
CapCut is available on mobile (iOS/Android) and desktop (Windows/Mac).
1. Download the app from the official store or website.
2. Create an account (using Google, TikTok, or email) to sync projects and access cloud features.

#### Preferences & Settings
Before starting a project, check your settings:
* **Default Frame Rate:** Set to match your source footage (usually 24fps for cinematic, 30fps for standard web, 60fps for gaming/smooth motion).
* **Cache Management:** CapCut creates temporary files. Regularly clear the cache in settings to free up hard drive space.

#### Project Basics
* **Create New Project:** This opens a blank timeline.
* **Importing Media:** Bring in your video clips, audio files, and images into the media bin.`
          },
          {
            id: 'c4_m1_t3',
            title: 'Interface & Timeline',
            content: `### Navigating the Workspace
#### The Interface
* **Media Bin:** Where all your imported files live.
* **Player Window:** Previews your edited video.
* **Timeline:** The bottom section where you arrange and edit your clips.
* **Details/Properties Panel:** Usually on the right; shows settings for the currently selected clip (scale, position, volume, etc.).

#### Timeline Controls
* **Playhead:** The vertical line indicating the current frame being viewed.
* **Zoom:** Zoom in for precise cuts, zoom out to see the whole project.
* **Snap:** When enabled, clips automatically align with each other or the playhead, making editing easier.
* **Undo/Redo:** Crucial shortcuts (Ctrl+Z / Ctrl+Y) for fixing mistakes.

#### Formats & Aspect Ratios
Choose the right ratio for your platform:
* **16:9 (Landscape):** Standard for YouTube, TV, and desktop viewing.
* **9:16 (Portrait):** Standard for TikTok, Instagram Reels, and YouTube Shorts.
* **1:1 (Square):** Often used for Instagram feed posts.`
          }
        ]
      },
      {
        id: 'c4_m2',
        title: 'Module 3-5: Advanced & AI',
        topics: [
          {
            id: 'c4_m2_t1',
            title: 'AI Automation',
            content: `### Editing Smarter, Not Harder
#### Auto Captions
CapCut's most powerful feature for social media.
1. Go to the Text tab > Auto Captions.
2. Select the language and click Create.
3. CapCut transcribes the audio and creates text layers. You can then batch-edit the font, color, and animation for all captions at once.

#### Background Removal
* **Auto Removal:** Uses AI to cut out a person from the background without a green screen. Great for talking-head videos.
* **Chroma Key:** The traditional method for removing a solid color background (like a green screen). Use the color picker and adjust intensity/shadow.

#### Templates & One-Click Editing
CapCut offers thousands of user-created templates. Select a template, swap in your own clips, and the app handles the timing, effects, and music.`
          },
          {
            id: 'c4_m2_t2',
            title: 'Advanced Optimization',
            content: `### Polishing the Final Product
#### Color Grading
* **Basic Adjustments:** Fix exposure (brightness/contrast) and white balance (temperature/tint).
* **Filters & LUTs:** Apply pre-made color looks to instantly change the mood of the video.
* **HSL (Hue, Saturation, Lightness):** Adjust specific colors individually (e.g., make the sky bluer without affecting skin tones).

#### Audio Mixing
Audio is 50% of the video experience.
* **Volume Levels:** Ensure dialogue is clear and music isn't overpowering.
* **Smart Fades:** Add fade-ins and fade-outs to audio clips to prevent abrupt cuts.
* **Noise Reduction:** Use CapCut's built-in tool to reduce background hum or hiss.

#### Exporting
* **Resolution:** 1080p is standard; 4K is higher quality but larger file size.
* **Bitrate:** Higher bitrate = better quality but larger file.
* **Export per Platform:** CapCut often has direct export options for TikTok, optimizing the settings automatically.`
          },
          {
            id: 'c4_m2_t3',
            title: 'Freelancing & Workflow',
            content: `### Turning Skills into Income
#### AI Reels Workflow
Short-form content is in high demand.
1. Source a long podcast or interview.
2. Find a compelling 30-60 second clip.
3. Edit in a 9:16 ratio.
4. Add Auto Captions, dynamic zoom-ins, and sound effects to retain viewer attention.

#### Manual Edit (YouTube Video)
Long-form content requires more structure.
1. **A-Roll:** Lay down the main narrative or talking head footage. Cut out mistakes and dead air.
2. **B-Roll:** Add supporting footage over the A-roll to illustrate what is being said.
3. **Graphics & Audio:** Add titles, lower thirds, music, and sound effects.

#### Full Automation Batch Processing
For faceless channels or bulk content creation:
* Script generation via ChatGPT.
* Voiceover via AI TTS (Text-to-Speech).
* Visuals via stock footage or AI image generation.
* Assemble rapidly in CapCut using templates and auto-features.`
          }
        ]
      }
    ]
  },
  {
    id: 'c5',
    title: 'AI Tools Mastery',
    description: 'Applied mastery of AI across writing, visuals, audio, and workflows.',
    icon: 'Bot',
    color: 'bg-cyan-500',
    chapters: [
      {
        id: 'c5_m1',
        title: 'Module 1-3: AI Fundamentals & Visuals',
        topics: [
          {
            id: 'c5_m1_t1',
            title: 'AI Introduction',
            content: `### Understanding the AI Revolution
#### Core Concepts
Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think and learn like humans.

#### Types of AI
* **Predictive AI:** Analyzes historical data to predict future outcomes (e.g., Netflix recommendations, weather forecasting).
* **Generative AI:** Creates new content (text, images, audio, code) based on patterns learned from existing data. This course focuses on Generative AI.

#### Large Language Models (LLMs)
LLMs (like ChatGPT, Gemini, Claude) are a type of Generative AI trained on vast amounts of text data. They understand context and generate human-like text by predicting the most likely next word in a sequence.

#### Ethics & Copyright
* **Bias:** AI models can inherit biases present in their training data.
* **Copyright:** The legal status of AI-generated content is still evolving. Generally, you cannot copyright a purely AI-generated image, but you can use it commercially depending on the tool's terms of service.`
          },
          {
            id: 'c5_m1_t2',
            title: 'Prompt Engineering',
            content: `### The Art of Talking to AI
A "prompt" is the instruction you give to an AI. Prompt engineering is crafting that instruction to get the best possible result.

#### The Perfect Prompt Structure
1. **Context:** Who are you? What is the background? (e.g., "Act as a senior marketing expert...")
2. **Task:** What exactly do you want the AI to do? (e.g., "...write a 300-word blog post about...")
3. **Constraints:** What are the rules? (e.g., "...use a professional tone, avoid jargon, include 3 bullet points.")
4. **Output Format:** How should it be presented? (e.g., "...format the output as a markdown table.")

#### Prompting Techniques
* **Zero-shot:** Asking a question without providing any examples.
* **One-shot:** Providing one example of the desired output before asking the question.
* **Few-shot:** Providing multiple examples to train the AI on the specific pattern or style you want.`
          },
          {
            id: 'c5_m1_t3',
            title: 'Visual AI',
            content: `### Generating Images and Video
#### Image Generation
Tools like Midjourney, DALL-E 3, and Meta AI convert text descriptions into images.
* **Prompting for Images:** Be specific about subject, medium (e.g., oil painting, 3D render, photograph), lighting, and camera angle.
* **Midjourney Basics:** Operates through Discord. Use \`/imagine\` followed by your prompt. Use parameters like \`--ar 16:9\` for aspect ratio.

#### Video Generation
Tools like Google Labs VEO, Sora, and Runway Gen-2 can generate short video clips from text or animate existing images.
* **Current Limitations:** Video generation is computationally expensive, so clips are usually short (3-10 seconds) and may have artifacts (weird physics or morphing).
* **Use Cases:** B-roll footage, abstract backgrounds, conceptual visualizations.`
          }
        ]
      },
      {
        id: 'c5_m2',
        title: 'Module 4-6: Branding & Audio',
        topics: [
          {
            id: 'c5_m2_t1',
            title: 'AI Branding & Logos',
            content: `### Building a Brand with AI
#### Concept Exploration
Use ChatGPT or Gemini to brainstorm brand names, taglines, and core values based on your target audience and niche.

#### Logo Generation
1. Use Midjourney or DALL-E to generate logo concepts. Prompt example: "A minimalist vector logo of a coffee cup, flat design, geometric, blue and gold colors, white background."
2. **Refinement:** AI struggles with exact text in logos. Generate the icon/symbol with AI, then use a tool like Canva or Illustrator to add the brand name with a professional font.

#### Vectorization
AI image generators output raster images (pixels). To use a logo professionally (for printing or scaling), it must be a vector. Use tools like Vectorizer.ai to convert the AI-generated PNG into an SVG file.`
          },
          {
            id: 'c5_m2_t2',
            title: 'Smart Document Conversion',
            content: `### AI for Productivity
#### Optical Character Recognition (OCR)
AI-powered OCR can extract text from images or scanned PDFs with high accuracy, even recognizing handwriting.

#### Document Translation & Summarization
* **Translation:** DeepL and Google Translate use advanced AI for highly accurate, context-aware translations.
* **Summarization:** Upload long PDFs or reports to Claude or ChatGPT and ask for a "TL;DR" (Too Long; Didn't Read), key takeaways, or specific data points.

#### Formatting Conversion
AI tools can intelligently convert complex PDFs into editable Word or Excel documents, maintaining tables and layouts much better than traditional converters.`
          },
          {
            id: 'c5_m2_t3',
            title: 'Text to Voice & Song',
            content: `### Synthesizing Audio
#### Text-to-Speech (TTS) Foundations
Modern AI voices (like ElevenLabs) sound incredibly realistic, complete with breathing and natural inflection.
* **Use Cases:** Voiceovers for YouTube videos, audiobooks, accessibility features.

#### Voice Cloning
Some tools allow you to upload a 1-minute sample of your own voice, and the AI will generate a clone. You can then type text, and it will be read in your voice. (Note: Ethical and legal restrictions apply).

#### AI Music Composition
Tools like Suno AI or Udio can generate full songs (vocals and instrumentation) based on a text prompt describing the genre, mood, and topic. You can even provide your own lyrics.`
          }
        ]
      },
      {
        id: 'c5_m3',
        title: 'Module 8-9: Sound & Presentations',
        topics: [
          {
            id: 'c5_m3_t1',
            title: 'AI Sound Generation',
            content: `### Enhancing Audio Quality
#### Sound Effect (SFX) Creation
AI models can generate specific sound effects based on text prompts (e.g., "footsteps on gravel in a cave"). Useful for video editors and game developers.

#### Audio Cleanup & Mixing
* **Noise Reduction:** Tools like Adobe Podcast AI can take a terrible, echoey recording with background noise and make it sound like it was recorded in a professional studio.
* **Mastering:** AI tools can automatically balance EQ, compression, and limiting to make a podcast or music track sound polished and ready for distribution.`
          },
          {
            id: 'c5_m3_t2',
            title: 'AI Presentation Generation',
            content: `### Creating Slides in Seconds
#### The AI Presentation Workflow
Tools like Gamma, Tome, or Canva's Magic Design can generate entire slide decks from a single prompt or a provided document.
1. **Plan:** Provide the AI with your topic, target audience, and key points.
2. **Create:** The AI generates an outline, writes the copy for each slide, and selects or generates relevant images.
3. **Polish:** AI presentations are a starting point, not a finished product. You must review the content for accuracy, adjust the design theme, and personalize the speaker notes.`
          }
        ]
      }
    ]
  },
  {
    id: 'c6',
    title: 'YouTube Automation',
    description: 'Secure account setup, AI-driven workflows, and monetization.',
    icon: 'Youtube',
    color: 'bg-red-600',
    chapters: [
      {
        id: 'c6_m1',
        title: 'Module 1: Secure Account Infrastructure',
        topics: [
          {
            id: 'c6_m1_t1',
            title: 'Gmail Creation (Global Standard)',
            content: `### Gmail Creation (Global Standard)
Guidelines for choosing professional, brandable English names that work across markets: shortlist criteria, availability checks, and brand-safe variations. Include templated name formats for faceless channels (e.g., Topic + Studio, Noun + Labs).`
          },
          {
            id: 'c6_m1_t2',
            title: 'Phone Verification Strategies',
            content: `### Phone Verification Strategies
Overview of legitimate alternatives and best practices to reduce friction during bulk account creation: using verified team phone numbers, Google Voice where permitted, and staged verification workflows. Emphasize compliance and risk mitigation — avoid black-hat shortcuts that invite bans.`
          },
          {
            id: 'c6_m1_t3',
            title: 'Managing Multiple Accounts Safely',
            content: `### Managing Multiple Accounts Safely
Account matrix: purpose, owner, recovery owner, and role-based access. Separate credentials per account, centralized password manager, unique device fingerprints via browser profiles, and audit cadence to detect anomalies.`
          },
          {
            id: 'c6_m1_t4',
            title: 'Security & Recovery',
            content: `### Security & Recovery
Step-by-step setup for secondary recovery emails, 2-Step Verification using authenticator apps, backup codes management, and scheduled security check-ups. Include recovery-playbook templates and an incident-response checklist to minimize downtime and prevent channel loss.`
          }
        ]
      },
      {
        id: 'c6_m2',
        title: 'Module 2: Channel Foundation & Branding',
        topics: [
          {
            id: 'c6_m2_t1',
            title: 'Niche Selection & Research',
            content: `### Niche Selection & Research
How to research niches balancing high CPM opportunities (finance, business, tech) vs. high-volume niches (entertainment, DIY). Use keyword gap analysis, competition depth, and CPM proxies to prioritize niches that scale with automation.`
          },
          {
            id: 'c6_m2_t2',
            title: 'Channel Handle & Naming',
            content: `### Channel Handle & Naming
Rules for unique names and handles: avoid trademark conflicts, ensure pronounceability, and include keywords when possible without sounding spammy. A/B test three variations with small audience polls or analytics micro-tests.`
          },
          {
            id: 'c6_m2_t3',
            title: 'Channel SEO Fundamentals',
            content: `### Channel SEO Fundamentals
Keyword research process for channel-wide discovery: primary channel keywords, optimized About section templates, and regional/category settings to align with target audiences. Include a template About copy optimized for discovery and trust signals.`
          },
          {
            id: 'c6_m2_t4',
            title: 'AI-Powered Visual Branding',
            content: `### AI-Powered Visual Branding
Practical workflows for generating profile images and banners using AI engines (Midjourney, DALL-E) plus Canva refinement. Provide prompt templates for consistent brand tone, color palette guidance tied to theme colors (#FFFFFF, #424242, #8F8F8F), and export size settings for YouTube.`
          }
        ]
      },
      {
        id: 'c6_m3',
        title: 'Module 3: Content Strategy & AI Automation',
        topics: [
          {
            id: 'c6_m3_t1',
            title: 'Content Foundations',
            content: `### Content Foundations
Define content as Value, Entertainment, or Information. Align content pillars to audience intent and lifetime value. Include checklists for ensuring each video serves one primary intent and 2–3 secondary intents to increase watch time and search relevance.`
          },
          {
            id: 'c6_m3_t2',
            title: 'Copyright & Fair Use',
            content: `### Copyright & Fair Use
Practical guide to content sourcing: when to license stock footage, how to document fair use rationale, and steps to quickly resolve claims. Include table of low-risk vs. high-risk assets and a template takedown/response script.`
          },
          {
            id: 'c6_m3_t3',
            title: 'Channel Formats',
            content: `### Channel Formats
Decision framework for faceless vs. personality-driven channels. Pros/cons for short-form vs. long-form content and a hybrid cadence recommendation (e.g., 3 shorts : 1 long weekly) to maximize reach and retention.`
          },
          {
            id: 'c6_m3_t4',
            title: 'AI Automation Workflow',
            content: `### AI Automation Workflow
End-to-end AI stack: prompt engineering templates for ChatGPT/Claude script drafts, ElevenLabs/Murf voice cloning and pros/cons, and video assembly with InVideo/Pictory. Provide a reproducible pipeline: Script -> Voice -> B-roll selection -> Edit -> Thumbnail -> Publish. Each step includes reproducible prompts, quality-control checkpoints, and human review gates to preserve originality and avoid policy violations while scaling production.`
          }
        ]
      },
      {
        id: 'c6_m4',
        title: 'Module 4: Visuals & Metadata Optimization',
        topics: [
          {
            id: 'c6_m4_t1',
            title: 'Thumbnail Strategy',
            content: `### Thumbnail Strategy
Psychology-driven thumbnail rules: strong focal point, high contrast, readable typography at 10% size, and color pops aligned with brand palette. Use AI for background removal and facial expression synthesis but always validate authenticity. **Pro tip:** Use thumbnail A/B tests (YouTube experiments or external panels) for top-performing images before scaling the creative across multiple videos.`
          },
          {
            id: 'c6_m4_t2',
            title: 'Content SEO Deep Dive',
            content: `### Content SEO Deep Dive
Title keyword hierarchy: primary keyword within first 60 characters, secondary keyword variations, and power words. Descriptions with structured timestamps, resource links, and auto-generated chapters. Tag strategy balancing broad and niche tags plus hashtag use for discovery.`
          }
        ]
      },
      {
        id: 'c6_m5',
        title: 'Module 5: Management & Monetization',
        topics: [
          {
            id: 'c6_m5_t1',
            title: 'Upload Best Practices',
            content: `### Upload Best Practices
When to Upload vs. Schedule vs. Premiere. Use scheduling to hit peak audience windows determined via analytics; use Premieres for community engagement with live chat and pinned comments.`
          },
          {
            id: 'c6_m5_t2',
            title: 'Retention & Interactivity',
            content: `### Retention & Interactivity
Strategic use of Cards and End Screens: placement rules to boost session value and channel-wide watch time. Include templates for CTAs that feel native and retain viewers into related content.`
          },
          {
            id: 'c6_m5_t3',
            title: 'Default Upload Settings',
            content: `### Default Upload Settings
Standardize metadata, default visibility, end screen templates, and comment moderation presets to reduce friction across multi-channel operations.`
          },
          {
            id: 'c6_m5_t4',
            title: 'YouTube Studio Review',
            content: `### YouTube Studio Review
How to read CPM, RPM, CTR, average view duration, and relative retention. Actionable routines: weekly analytics checkpoints, monthly content experiments, and quarterly strategy pivots based on cohort performance. Include a reproducible analytics checklist: top 3 videos by watch time, top 3 by CPM, and content gap opportunities to exploit.`
          }
        ]
      },
      {
        id: 'c6_m6',
        title: 'Module 6: Monetization Setup & Compliance',
        topics: [
          {
            id: 'c6_m6_t1',
            title: 'YPP Eligibility Roadmap',
            content: `### YPP Eligibility Roadmap
Clear milestones and timelines to reach 1,000 subscribers and 4,000 public watch hours. Strategies to accelerate qualifying watch time ethically — playlists, watch-next cliffs, and repackaging long-form into short series.`
          },
          {
            id: 'c6_m6_t2',
            title: 'AdSense & Tax Setup',
            content: `### AdSense & Tax Setup
Step-by-step AdSense application checklist, required identity verification, and a summary of common tax information submissions for U.S. creators and international considerations.`
          },
          {
            id: 'c6_m6_t3',
            title: 'Copyright & Strikes Management',
            content: `### Copyright & Strikes Management
Operational playbook for strike prevention, proper licensing, claim resolution templates, and escalation paths for disputes. Include documentation templates to demonstrate ownership and permissions. Monetization is not only about meeting thresholds but keeping your channel healthy — this module emphasizes sustainable revenue practices and policy-first operations.`
          }
        ]
      },
      {
        id: 'c6_m7',
        title: 'Module 7: Templates, Tools & Prompt Library',
        topics: [
          {
            id: 'c6_m7_t1',
            title: 'Operational Templates',
            content: `### Operational Templates
Upload checklist, security audit sheet, dispute response templates, and a monthly analytics review spreadsheet you can clone to manage multi-channel portfolios.`
          },
          {
            id: 'c6_m7_t2',
            title: 'AI Prompt Library',
            content: `### AI Prompt Library
Editable prompts for script generation, title+description optimization, thumbnail variants, and voice instruction prompts tailored for ElevenLabs and Murf. Prompts are annotated with quality-control checks and substitution variables for scale.`
          }
        ]
      },
      {
        id: 'c6_m8',
        title: 'Module 8: Next Steps, Assessment & Certification',
        topics: [
          {
            id: 'c6_m8_t1',
            title: 'Capstone Project',
            content: `### Capstone Project
Build and launch a fully automated video from idea to monetization: choose a niche, create 3 videos using the AI pipeline, set up channel defaults, and produce a 30-day growth plan. Assessment will include audits of security, brand assets, metadata, and analytics setup.`
          },
          {
            id: 'c6_m8_t2',
            title: 'Grading & Certification',
            content: `### Grading & Certification
Rubric: Security (25%), Content Quality (25%), SEO & Metadata (20%), Visuals (15%), Monetization Readiness (15%). Certified creators receive a digital badge and access to an alumni toolkit for scaling operations.`
          },
          {
            id: 'c6_m8_t3',
            title: 'Recommended Timeline',
            content: `### Recommended Timeline
Suggested pacing: 6–8 weeks at a part-time pace (5–10 hours/week). Accelerated tracks and team cohorts available for creators aiming to scale multiple channels simultaneously. Ready-to-use next steps, resources, and community channels will be provided upon enrollment. This course equips creators with both the systems and the tactical playbooks required to build monetizable, automatable YouTube channels while protecting long-term channel health.`
          }
        ]
      }
    ]
  },
  {
    id: 'c7',
    title: 'App Dev (Gemini 3.1 Pro)',
    description: 'Build production-ready web and Android apps accelerated by AI.',
    icon: 'Code',
    color: 'bg-gray-800',
    chapters: [
      {
        id: 'c7_m1',
        title: 'Module 1-3: Foundations & Prompts',
        topics: [
          { id: 'c7_m1_t1', title: 'Foundations of AI Dev', content: 'Scope of AI in Web & Android, Role of Gemini 3.1 Pro, Coding Languages Overview.' },
          { id: 'c7_m1_t2', title: 'Environment Setup', content: 'Node.js & NPM, Android Studio Panda 2, Gemini Integration.' },
          { id: 'c7_m1_t3', title: 'Google AI Studio', content: 'Navigating AI Studio, Temperature & Safety, Multi-Prompt & Chain Strategies, Context & Token Management.' }
        ]
      },
      {
        id: 'c7_m2',
        title: 'Module 4-7: Architecture & Deployment',
        topics: [
          { id: 'c7_m2_t1', title: 'Professional Prompt Engineering', content: 'Prompt Structure, Debugging with Prompts, Logic & Complex Algorithms.' },
          { id: 'c7_m2_t2', title: 'Advanced Architecture', content: 'Frontend (User-Facing), Backend & Admin.' },
          { id: 'c7_m2_t3', title: 'Database & Auth (Firebase)', content: 'Firebase Integration, Authentication, Firestore & Realtime DB, Hosting & Storage.' },
          { id: 'c7_m2_t4', title: 'Deployment & APK', content: 'Web Deployment, Android Build Preparation, Generating APK / AAB, Final Debugging & Release.' }
        ]
      }
    ]
  },
  {
    id: 'c8',
    title: 'Facebook Mastery',
    description: 'Account hygiene, page branding, content systems, and monetization.',
    icon: 'Facebook',
    color: 'bg-blue-600',
    chapters: [
      {
        id: 'c8_m1',
        title: 'Module 1: Profile & Identity Foundation',
        topics: [
          {
            id: 'c8_m1_t1',
            title: 'Professional Account Creation',
            content: `### Professional Account Creation
Step-by-step setup: choose a business-ready name, select a branded email, and enable strong password policies. Add 2-Factor Authentication and recovery options. Optimize bio with 1–2-line value proposition, contact info, and a short branded tagline to help the algorithm and humans understand who you are.`
          },
          {
            id: 'c8_m1_t2',
            title: 'Privacy & Compliance',
            content: `### Privacy & Compliance
Configure friend lists, profile visibility, and post audiences. Learn the top triggers for account flags and how to keep activity organic and compliant. Understand Meta Community Standards that most often cause account restrictions — copyrighted media, policy-violating content, and impersonation risks — and how to avoid them.`
          }
        ]
      },
      {
        id: 'c8_m2',
        title: 'Module 2: Strategic Page Creation & Branding',
        topics: [
          {
            id: 'c8_m2_t1',
            title: 'Choose the Right Page Type',
            content: `### Choose the Right Page Type
Business, Creator, or Shop — pick the category that unlocks the features you need (commerce, messaging, analytics). The category affects discoverability and available CTAs.`
          },
          {
            id: 'c8_m2_t2',
            title: 'Optimize Name & Username',
            content: `### Optimize Name & Username
Use a searchable page name and a short handle. Include location or niche keyword only when it helps discovery. Avoid symbols or long strings that reduce credibility.`
          },
          {
            id: 'c8_m2_t3',
            title: 'AI-Driven Visual Branding',
            content: `### AI-Driven Visual Branding
Rapidly generate logos, cover banners, and post templates with AI tools. Create 3 variations: brand, campaign, and seasonal — export in the correct pixel sizes for profile photos, cover images, and story backgrounds.`
          },
          {
            id: 'c8_m2_t4',
            title: 'CTA & Messaging Setup',
            content: `### CTA & Messaging Setup
Configure primary CTAs (Message, WhatsApp, Visit Website). Add instant replies and FAQ automation. Set expectations in your welcome message: response time, best contact hours, and priority links.`
          }
        ]
      },
      {
        id: 'c8_m3',
        title: 'Module 3: Advanced Page Management',
        topics: [
          {
            id: 'c8_m3_t1',
            title: 'Roles & Permissions',
            content: `### Roles & Permissions
Assign Admin, Editor, Moderator, Advertiser roles carefully. Use least-privilege principle: only give people the permission they need. Regularly audit role assignments and remove old access.`
          },
          {
            id: 'c8_m3_t2',
            title: 'Meta Business Suite',
            content: `### Meta Business Suite
Centralize scheduling, cross-posting to Instagram, and analytics. Build weekly content batches and use drafts to streamline approvals. Use saved replies for recurring customer messages.`
          },
          {
            id: 'c8_m3_t3',
            title: 'Inbox & Engagement',
            content: `### Inbox & Engagement
Set response time targets, triage messages (sales, support, spam), and keep canned replies updated. Turn important conversations into leads by using saved notes and tag systems inside your inbox.`
          },
          {
            id: 'c8_m3_t4',
            title: 'Comments & Crisis Handling',
            content: `### Comments & Crisis Handling
Use moderation tools, keyword filters, and a pre-approved answer set for common negative feedback. Convert criticism into trust by responding publicly then moving to private messages when needed.`
          }
        ]
      },
      {
        id: 'c8_m4',
        title: 'Module 4: Content Strategy & Posting System',
        topics: [
          {
            id: 'c8_m4_t1',
            title: 'High-Engagement Content Types',
            content: `### High-Engagement Content Types
Prioritize reels with strong first 3 seconds, native captions, and a single clear CTA. Combine image carousels, polls, and long-form video to serve different audiences and extend organic reach. Repurpose long-form video into multiple short clips and thumbnails.`
          },
          {
            id: 'c8_m4_t2',
            title: 'Viral Growth Techniques',
            content: `### Viral Growth Techniques
Hook -> Value -> CTA. Use curiosity, contradiction, or surprise in opening lines. Test 3 headline styles per post, A/B captions, and 5–10 relevant hashtags. Track hashtag performance weekly and double down on what works.`
          },
          {
            id: 'c8_m4_t3',
            title: 'Posting Optimization',
            content: `### Posting Optimization
Build a "Posting Clock" by analyzing Insights for your audience: post frequency, best dayparts, and peak engagement windows. Batch-create content and schedule with Meta Business Suite; leave room each week for trend-reactive posts.`
          }
        ]
      },
      {
        id: 'c8_m5',
        title: 'Module 5: Organic Growth System (Groups & Sharing)',
        topics: [
          {
            id: 'c8_m5_t1',
            title: 'Facebook Group Ecosystem',
            content: `### Facebook Group Ecosystem
Map niche groups by activity level (daily posts, comment depth) and membership relevance. Participate with value-first posts — answer questions, share short tutorials, and spotlight members. Use group polls and live Q&A to boost engagement and trust.`
          },
          {
            id: 'c8_m5_t2',
            title: 'Smart Sharing Strategies',
            content: `### Smart Sharing Strategies
Avoid spam: tailor shared captions to group tone, limit frequency, and add value (solutions, checklists). Use S4S responsibly by matching audience fit and sharing win/win content. If you use multiple profiles for amplification, keep interactions organic to stay within platform rules.`
          }
        ]
      },
      {
        id: 'c8_m6',
        title: 'Module 6: Video Content & Niche Research',
        topics: [
          {
            id: 'c8_m6_t1',
            title: 'Niche Selection',
            content: `### Niche Selection
Choose niches that match your expertise and have proven engagement: Entertainment (shareable), Gaming (community-driven), Education (evergreen), Lifestyle (visual aspirational). Validate niches via audience demand signals: group activity, keyword search volume, and reel performance.`
          },
          {
            id: 'c8_m6_t2',
            title: 'Content Creation',
            content: `### Content Creation
Structure videos to include: 1) 0–3s hook, 2) clear value or story arc, 3) a tight call-to-action. Edit for platform native norms — vertical 9:16 for reels, square 1:1 for feed, and 16:9 for longer content. Caption every video and include a short pinned comment with resources or a lead magnet.`
          },
          {
            id: 'c8_m6_t3',
            title: 'Copyright Awareness',
            content: `### Copyright Awareness
Use royalty-free or licensed tracks and clear any third-party footage. Keep a content log for each asset (source, license, timestamp) to streamline dispute resolution if needed.`
          },
          {
            id: 'c8_m6_t4',
            title: 'Quick Production Checklist',
            content: `### Quick Production Checklist
- Hook written before filming
- Shotlist with close, mid, wide
- Export presets for 9:16, 1:1, and 16:9
- Captions and thumbnail saved
- Copyright license recorded`
          }
        ]
      },
      {
        id: 'c8_m7',
        title: 'Module 7: E-Commerce & Sales (Facebook Selling)',
        topics: [
          {
            id: 'c8_m7_t1',
            title: 'Marketplace Mastery',
            content: `### Marketplace Mastery
Create high-converting listings: 5–8 sharp photos, keyword-rich title, benefits-first description, and competitive pricing. Use local shipping and pickup options when relevant, and enable shipping to expand reach.`
          },
          {
            id: 'c8_m7_t2',
            title: 'Product Promotion & Lead Gen',
            content: `### Product Promotion & Lead Gen
Use page posts with lead magnets to capture emails. Boost posts strategically to test ad creative and product-market fit. For lightweight campaigns, use boosted post targeting with lookalikes based on engagers.`
          },
          {
            id: 'c8_m7_t3',
            title: 'Customer Trust & Conversion',
            content: `### Customer Trust & Conversion
Collect reviews and display them prominently. Standardize replies for common purchase questions and set clear shipping/return policies. Use order confirmation messages to cross-sell and request reviews.`
          }
        ]
      },
      {
        id: 'c8_m8',
        title: 'Module 8: Monetization & Revenue Setup',
        topics: [
          {
            id: 'c8_m8_t1',
            title: 'Monetization Eligibility',
            content: `### Monetization Eligibility
Understand eligibility for In-Stream Ads, Stars, Reels Play Bonus, and other programs. Key criteria: original content, consistent engagement, and policy-compliant material. Keep a content provenance log to prove originality if requested.`
          },
          {
            id: 'c8_m8_t2',
            title: 'Payout & Tax Setup',
            content: `### Payout & Tax Setup
Add payout details (bank or payout partner), verify identity, and complete required tax forms. Schedule payouts and confirm thresholds. Plan around payout delays by maintaining a 30–60 day cash runway.`
          },
          {
            id: 'c8_m8_t3',
            title: 'Revenue Metrics',
            content: `### Revenue Metrics
Know the difference between CPM (cost to advertisers) and RPM (your revenue per 1,000 views). Track RPM weekly, monitor program changes, and diversify earnings (ads + stars + commerce) to stabilize income.`
          }
        ]
      },
      {
        id: 'c8_m9',
        title: 'Next Steps: Launch Plan & Course Action Guide',
        topics: [
          {
            id: 'c8_m9_t1',
            title: '1. Secure & Setup Account',
            content: `### 1. Secure & Setup Account
Create your primary business account, enable 2FA, and set recovery contacts. Optimize profile bio and contact details.`
          },
          {
            id: 'c8_m9_t2',
            title: '2. Build & Brand Page',
            content: `### 2. Build & Brand Page
Choose category, set up handle, upload logo & cover, configure CTAs, and publish a short welcome post with pinned contact info.`
          },
          {
            id: 'c8_m9_t3',
            title: '3. Create First 30 Pieces of Content',
            content: `### 3. Create First 30 Pieces of Content
Batch-produce 10 reels, 10 image posts, and 10 community posts. Use the Posting Clock to schedule and reserve 20% capacity for trend-reactive content.`
          },
          {
            id: 'c8_m9_t4',
            title: '4. Launch Sales Channel',
            content: `### 4. Launch Sales Channel
List 5 products on Marketplace, create one lead magnet for page followers, and set up automated responses for inquiries.`
          },
          {
            id: 'c8_m9_t5',
            title: '5. Apply for Monetization',
            content: `### 5. Apply for Monetization
Verify eligibility, complete payout & tax info, and start tracking RPM & engagement metrics to optimize revenue.`
          },
          {
            id: 'c8_m9_t6',
            title: 'Final Guidance',
            content: `### Final Guidance
Iterate quickly, measure consistently, and keep content original. Use the course modules as an operational playbook — each module maps to a weekly sprint you can execute in 4–8 weeks to move from setup to revenue.`
          }
        ]
      }
    ]
  },
  {
    id: 'c9',
    title: 'Local Dropshipping',
    description: 'Start local dropshipping using Markaz and social platforms.',
    icon: 'ShoppingCart',
    color: 'bg-teal-500',
    chapters: [
      {
        id: 'c9_m1',
        title: 'Module 1-3: Fundamentals & Sourcing',
        topics: [
          { id: 'c9_m1_t1', title: 'Dropshipping Fundamentals', content: 'What is Local Dropshipping? No Inventory Model, Rules & Ethics, Profit Margin Calculation.' },
          { id: 'c9_m1_t2', title: 'Product Research', content: 'Trending Products, Problem-Solving Products, Season-Based Selection, Price Comparison.' },
          { id: 'c9_m1_t3', title: 'Product Sourcing', content: 'Markaz App Deep Dive, Category Exploration, Local Market Sourcing, Quality Check.' }
        ]
      },
      {
        id: 'c9_m2',
        title: 'Module 4-7: Sales & Management',
        topics: [
          { id: 'c9_m2_t1', title: 'Brand Setup & Channels', content: 'Business Profiles, WhatsApp Business, Branding Essentials, Professional Page Setup.' },
          { id: 'c9_m2_t2', title: 'Marketing Strategy', content: 'TikTok & Reels, Facebook & Instagram, WhatsApp Marketing, YouTube Shorts.' },
          { id: 'c9_m2_t3', title: 'Order Management', content: 'Customer Interaction, Order Placement (Markaz), Tracking & Delivery.' },
          { id: 'c9_m2_t4', title: 'Financial Tracking', content: 'Master Google Sheet Setup, Revenue & Profit Tracking, Expense Management.' }
        ]
      }
    ]
  },
  {
    id: 'c10',
    title: 'Organic Digital Marketing',
    description: 'Zero budget strategies to attract, build trust, and convert audiences.',
    icon: 'TrendingUp',
    color: 'bg-green-600',
    chapters: [
      {
        id: 'c10_m1',
        title: 'Module 1-4: Foundations & Growth',
        topics: [
          { id: 'c10_m1_t1', title: 'Foundations', content: 'Digital vs Traditional, Paid vs Organic Reach, Psychology of Selling, Niche Selection.' },
          { id: 'c10_m1_t2', title: 'Content Strategy', content: 'Content Pillars, Brand Basics, Storytelling, Visual Tools.' },
          { id: 'c10_m1_t3', title: 'Copywriting & Engagement', content: 'Copy Basics, Hooks & CTAs, Write for Actions, Engagement Tactics.' },
          { id: 'c10_m1_t4', title: 'Social Media Growth', content: 'Facebook, Instagram, TikTok, LinkedIn.' }
        ]
      },
      {
        id: 'c10_m2',
        title: 'Module 5-9: SEO & Scaling',
        topics: [
          { id: 'c10_m2_t1', title: 'SEO Essentials', content: 'Keyword research, On-page SEO, Local SEO, YouTube SEO.' },
          { id: 'c10_m2_t2', title: 'YouTube & Video Marketing', content: 'Video SEO, YouTube Shorts, Community Engagement.' },
          { id: 'c10_m2_t3', title: 'Lead Gen & Audience', content: 'Lead Magnets, WhatsApp, Email sequences.' },
          { id: 'c10_m2_t4', title: 'Influence & Analytics', content: 'Micro-Influencer Collabs, Guest Posting, Quora & Reddit. Analytics, Conversion & Scaling.' }
        ]
      }
    ]
  }
];
