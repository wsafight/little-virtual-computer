window.programs = {
  'Add':
    `
define a 0
define b 1
define result 2
copy_to_from_constant a 4
copy_to_from_constant b 4
add a b result
; look at memory location 2, you should now see '8'
`,

  'RandomPixels':
    `
define videoStartAddr 2100
define videoEndAddr 3000
define randomNumberAddr 2050
define numColors 16
FillScreen:
define fillScreenPtr 0 ; address at which store address of current screen pixel in loop
copy_to_from_constant fillScreenPtr videoStartAddr ; initialize to point to first pixel
jump_to FillScreenLoop
FillScreenLoop:
define tempAddr 1 ; address to use for temporary storage
; modulo random value by number of colors in palette to get a random color...
modulo_constant randomNumberAddr numColors tempAddr
; ...and write it to current screen pixel, eg. the address pointed to by fillScreenPtr
copy_into_ptr_from fillScreenPtr tempAddr
; increment pointer to point to next screen pixel address
add_constant fillScreenPtr 1 fillScreenPtr
branch_if_not_equal_constant fillScreenPtr videoEndAddr FillScreenLoop ; if not finished, repeat
jump_to FillScreen ; filled screen, now start again from the top
`,

  'Paint':
    `Init:
define colorPickerStartAddr 2100
define colorPickerEndAddr 2116
define mousePixelAddr 2012
define mouseButtonAddr 2013
define currentColorAddr 0
define loopCounterAddr 1
define numColors 16
define comparisonResultAddr 4
define lastClickedAddr 2
define lessThanResult -1
copy_to_from_constant loopCounterAddr colorPickerStartAddr ; init loop counter to start of video memory
copy_to_from_constant currentColorAddr 0 ; we'll use this while drawing color picker
DrawColorPickerLoop:
copy_into_ptr_from loopCounterAddr currentColorAddr
add_constant loopCounterAddr 1 loopCounterAddr
add_constant currentColorAddr 1 currentColorAddr
branch_if_not_equal_constant loopCounterAddr colorPickerEndAddr DrawColorPickerLoop
copy_to_from_constant currentColorAddr 3; initial color (green)
MainLoop:
branch_if_equal_constant mouseButtonAddr loopCounterAddr HandleClick
jump_to MainLoop
HandleClick:
copy_to_from lastClickedAddr mousePixelAddr ; store mouse location in case it changes
compare_constant lastClickedAddr colorPickerEndAddr comparisonResultAddr
branch_if_equal_constant comparisonResultAddr lessThanResult SelectColor
jump_to PaintAtCursor
SelectColor:
subtract_constant lastClickedAddr colorPickerStartAddr currentColorAddr
jump_to MainLoop
PaintAtCursor:
copy_into_ptr_from lastClickedAddr currentColorAddr ; set pixel at mouse cursor to color at currentColorAddr
jump_to MainLoop
`,

  'ChocolateRain': `
define accumulatorAddr 0
define dataTempAddr 1
define musicPlayheadPtr 2
define startTimeAddr 3
define channelDestinationPtr 4
define currentTimeAddr 2051
define beatLengthInMS 200
define ch1WaveTypeAddr 3000
define ch1FreqAddr 3001
define ch2WaveTypeAddr 3003
copy_to_from_constant ch1WaveTypeAddr 3 ; sine
copy_to_from_constant ch2WaveTypeAddr 0 ; sawtooth
Reset:
copy_to_from startTimeAddr currentTimeAddr ; keep time started to calculate time elapsed
copy_address_of_label musicPlayheadPtr MusicData
WaitForEvent:
; calculate current beat from time
subtract currentTimeAddr startTimeAddr accumulatorAddr
divide_constant accumulatorAddr beatLengthInMS accumulatorAddr
copy_to_from_ptr dataTempAddr musicPlayheadPtr
branch_if_equal_constant dataTempAddr -1 Reset
compare accumulatorAddr dataTempAddr dataTempAddr
branch_if_not_equal_constant dataTempAddr -1 PlayNote
jump_to WaitForEvent
PlayNote:
; advance source pointer to channel data
add_constant musicPlayheadPtr 1 musicPlayheadPtr
; move dest pointer to frequency address for channel
copy_to_from_constant channelDestinationPtr ch1FreqAddr ; move to ch1FreqAddr
; in dataTempAddr, calculate relative offset of channel's frequency address from ch1FreqAddr
copy_to_from_ptr dataTempAddr musicPlayheadPtr
multiply_constant dataTempAddr 3 dataTempAddr
; increment pointer by channel offset to point to correct channel's frequency address
add channelDestinationPtr dataTempAddr channelDestinationPtr
add_constant musicPlayheadPtr 1 musicPlayheadPtr ; advance source pointer to frequency data
; copy frequency
copy_to_from_ptr dataTempAddr musicPlayheadPtr
copy_into_ptr_from channelDestinationPtr dataTempAddr
; move destination pointer to volume address for channel
add_constant channelDestinationPtr 1 channelDestinationPtr
; advance source pointer to volume dataTempAddr
add_constant musicPlayheadPtr 1 musicPlayheadPtr
; copy volume
copy_to_from_ptr dataTempAddr musicPlayheadPtr
copy_into_ptr_from channelDestinationPtr dataTempAddr
add_constant musicPlayheadPtr 1 musicPlayheadPtr ; advance to next music event
jump_to WaitForEvent
MusicData:
data  0 1 195997  53
data  0 0 622253  53
data  0 0 130812  53
data  1 0 622253  0
data  1 0 622253  58
data  2 1 195997  0
data  2 1 155563  56
data  2 0 130812  0
data  2 0 622253  0
data  2 0 783990  68
data  3 0 783990  0
data  3 0 523251  49
data  4 1 155563  0
data  4 1 195997  64
data  4 0 523251  0
data  4 0 698456  64
data  4 0 233081  52
data  5 0 698456  0
data  5 0 466163  50
data  6 1 195997  0
data  6 0 233081  0
data  6 0 466163  0
data  6 0 587329  64
data  7 0 587329  0
data  7 0 622253  60
data  7 0 195997  51
data  8 0 622253  0
data  8 0 311126  43
data  9 0 195997  0
data  9 0 311126  0
data  9 0 523251  69
data  10  0 523251  0
data  10  0 391995  50
data  11  0 391995  0
data  11  0 587329  71
data  11  0 146832  50
data  12  0 146832  0
data  12  0 587329  0
data  12  0 391995  50
data  13  0 391995  0
data  13  0 466163  61
data  14  0 466163  0
data  14  0 523251  63
data  14  0 155563  50
data  15  1 146832  50
data  15  0 523251  0
data  15  0 391995  51
data  16  1 146832  0
data  16  1 155563  57
data  16  0 155563  0
data  16  0 391995  0
data  16  0 622253  68
data  16  0 207652  60
data  17  0 622253  0
data  17  0 622253  60
data  18  1 155563  0
data  18  1 195997  62
data  18  0 207652  0
data  18  0 622253  0
data  18  0 783990  63
data  18  0 311126  70
data  19  1 195997  0
data  19  1 174614  54
data  19  0 783990  0
data  19  0 523251  46
data  20  1 174614  0
data  20  0 311126  0
data  20  0 523251  0
data  20  0 698456  66
data  20  0 293664  57
data  21  1 146832  55
data  21  0 698456  0
data  21  0 466163  51
data  22  0 293664  0
data  22  0 466163  0
data  22  0 587329  65
data  22  0 233081  52
data  23  1 146832  0
data  23  1 155563  59
data  23  0 233081  0
data  23  0 587329  0
data  23  0 622253  63
data  23  0 261625  65
data  24  0 622253  0
data  24  0 311126  41
data  25  1 155563  0
data  25  1 130812  57
data  25  0 261625  0
data  25  0 311126  0
data  25  0 523251  66
data  25  0 195997  58
data  26  0 523251  0
data  26  0 391995  53
data  27  1 130812  0
data  27  1 146832  60
data  27  0 195997  0
data  27  0 391995  0
data  27  0 587329  69
data  27  0 233081  63
data  28  0 587329  0
data  28  0 391995  52
data  29  1 146832  0
data  29  1 116540  56
data  29  0 233081  0
data  29  0 391995  0
data  29  0 466163  59
data  30  1 116540  0
data  30  1 130812  63
data  30  0 466163  0
data  30  0 523251  61
data  30  0 261625  56
data  31  0 523251  0
data  31  0 391995  50
data  32  1 130812  0
data  32  1 233081  65
data  32  0 261625  0
data  32  0 391995  0
data  32  0 622253  73
data  32  0 207652  53
data  33  0 622253  0
data  33  0 622253  60
data  34  1 233081  0
data  34  1 155563  52
data  34  0 207652  0
data  34  0 622253  0
data  34  0 783990  64
data  35  0 783990  0
data  35  0 523251  50
data  36  1 155563  0
data  36  1 195997  62
data  36  0 523251  0
data  36  0 932327  71
data  36  0 174614  53
data  37  0 932327  0
data  37  0 466163  43
data  38  1 195997  0
data  38  0 174614  0
data  38  0 466163  0
data  38  0 587329  62
data  39  0 587329  0
data  39  0 622253  60
data  39  0 261625  50
data  40  0 622253  0
data  40  0 311126  43
data  41  0 261625  0
data  41  0 311126  0
data  41  0 523251  66
data  42  0 523251  0
data  42  0 391995  53
data  43  0 391995  0
data  43  0 587329  68
data  43  0 293664  55
data  44  0 293664  0
data  44  0 587329  0
data  44  0 391995  49
data  45  0 391995  0
data  45  0 466163  67
data  46  0 466163  0
data  46  0 523251  67
data  46  0 311126  50
data  47  1 146832  54
data  47  0 523251  0
data  47  0 523251  61
data  48  1 146832  0
data  48  1 155563  60
data  48  0 311126  0
data  48  0 523251  0
data  48  0 1046502 71
data  48  0 207652  53
data  49  0 1046502 0
data  49  0 523251  45
data  50  1 155563  0
data  50  1 195997  64
data  50  0 207652  0
data  50  0 523251  0
data  50  0 783990  68
data  51  1 195997  0
data  51  1 174614  60
data  51  0 783990  0
data  51  0 783990  58
data  52  1 174614  0
data  52  0 783990  0
data  52  0 932327  64
data  52  0 195997  53
data  53  1 146832  50
data  53  0 932327  0
data  53  0 466163  43
data  54  0 195997  0
data  54  0 466163  0
data  54  0 698456  64
data  55  1 146832  0
data  55  1 155563  58
data  55  0 698456  0
data  55  0 783990  64
data  55  0 207652  51
data  56  0 783990  0
data  56  0 415304  43
data  57  1 155563  0
data  57  1 130812  56
data  57  0 207652  0
data  57  0 415304  0
data  57  0 622253  67
data  58  0 622253  0
data  58  0 523251  56
data  59  1 130812  0
data  59  1 146832  57
data  59  0 523251  0
data  59  0 698456  71
data  59  0 233081  57
data  60  0 233081  0
data  60  0 698456  0
data  60  0 466163  49
data  61  1 146832  0
data  61  1 116540  52
data  61  0 466163  0
data  61  0 587329  64
data  62  1 116540  0
data  62  1 130812  57
data  62  0 587329  0
data  62  0 622253  62
data  62  0 261625  56
data  64  1 130812  0
data  64  1 195997  64
data  64  0 261625  0
data  64  0 622253  0
data  64  0 622253  61
data  64  0 130812  52
data -1
`,

  'Custom 1': '',
  'Custom 2': '',
  'Custom 3': '',
}