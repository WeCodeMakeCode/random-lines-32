namespace SpriteKind {
    export const Output = SpriteKind.create()
    export const None = SpriteKind.create()
}
function make_background () {
    W = 100
    H = 100
    scene.setBackgroundColor(9)
    SI = image.create(W, H)
    Screen = sprites.create(SI, SpriteKind.None)
    Screen.image.fill(15)
    Screen.y += -7
}
function re_draw_from_saved (b_use_saved_color: boolean) {
    if (b_black_background) {
        Screen.image.fill(15)
    } else {
        Screen.image.fill(1)
    }
    redraw_ndx = 0
    while (redraw_ndx < Slider) {
        S_line = saved_line_points[redraw_ndx]
        if (b_use_saved_color) {
            next__color = saved_colors[redraw_ndx]
        } else {
            get_next_random_or_cycle_color()
            saved_colors[redraw_ndx] = next__color
        }
        draw_line(S_line, next__color)
        redraw_ndx += 1
    }
}
function points_to_coordinates (p1: number, p2: number) {
    A = Ax[P1]
    B = Ay[P1]
    X = Ax[P2]
    Y = Ay[P2]
}
function do_from_1_to_slider_value_lines () {
    if (b_black_background) {
        Screen.image.fill(15)
    } else {
        Screen.image.fill(1)
    }
    saved_line_points = []
    saved_colors = []
    N_dupes = 0
    N_same_side = 0
    line_ndx = 0
    while (line_ndx < Slider) {
        add_a_new_line()
        line_ndx += 1
    }
}
function is_line_valid (pt1: number, pt2: number, pts_as_string: string) {
    Cmt = "Are points on same side?"
    points_to_coordinates(pt1, pt2)
    X_same = A == X
    Y_same = B == Y
    if (X_same || Y_same) {
        b_line_is_valid = false
        N_same_side += 1
        do_same_side_output()
    } else {
        Cmt = "Is line Duplicate?"
        Indx = saved_line_points.indexOf(pts_as_string)
        if (Indx > -1) {
            b_line_is_valid = false
            N_dupes += 1
            do_dupe_output()
        } else {
            b_line_is_valid = true
        }
    }
}
function get_next_random_or_cycle_color () {
    if (b_random_colors) {
        next__color = Math.randomRange(1, 15)
    } else {
        next__color = cycle_color
    }
}
function up_down (adj: number) {
    b_random_colors = false
    cycle_color = cycle_color + adj
    if (cycle_color == 16) {
        cycle_color = 1
    } else {
        if (cycle_color == 0) {
            cycle_color = 15
        }
    }
    re_draw_from_saved(constant_DO_NOT_use_saved_colors)
}
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    slider_right()
})
function do_dupe_output () {
    if (B_extra_output) {
        Sout = "" + N_dupes + " Dupe"
        Out0.say(Sout, 500)
    }
}
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    up_down(-1)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    slider_left()
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    up_down(-1)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    b_black_background = !(b_black_background)
    re_draw_from_saved(constant_use_saved_colors)
})
function slider_right () {
    if (Slider + 1 < 101) {
        set_slider(Slider + 1)
        add_a_new_line()
    }
}
function set_slider (n: number) {
    Slider = n
    Curser.x = curser_base + n
    Curser.say("" + Slider)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Slider == 0) {
        B_extra_output = !(B_extra_output)
    } else {
        if (b_random_colors) {
            re_draw_from_saved(constant_DO_NOT_use_saved_colors)
        } else {
            b_random_colors = true
            re_draw_from_saved(constant_DO_NOT_use_saved_colors)
        }
    }
})
function slider_left () {
    if (Slider == 0) {
        saved_line_points = []
        saved_colors = []
        N_dupes = 0
        N_same_side = 0
    } else {
        set_slider(Slider - 1)
        removed = saved_line_points.pop()
        removed_n = saved_colors.pop()
        re_draw_from_saved(constant_use_saved_colors)
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    slider_right()
})
function init_perimeter_arrays () {
    Ax = []
    Ay = []
    for (let index = 0; index <= W - 1; index++) {
        Ax.push(index)
        Ay.push(0)
    }
    for (let index = 0; index <= H - 1; index++) {
        Ax.push(W - 1)
        Ay.push(index)
    }
    for (let index = 0; index <= W - 1; index++) {
        Ax.push(W - 1 - index)
        Ay.push(H - 1)
    }
    for (let index = 0; index <= H - 1; index++) {
        Ax.push(0)
        Ay.push(H - index)
    }
    Len_Axy_m1 = Ax.length - 1
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    up_down(1)
})
function pack_s_line (point_1: number, point_2: number) {
    S_line = "" + point_1 + "|" + point_2
}
function do_instructions () {
    game.showLongText("Right/Left arrows increase/decrease the number of lines.", DialogLayout.Top)
    game.showLongText("Up/Down arrows change the color of lines.", DialogLayout.Top)
    game.showLongText("Button A sets random colors. ", DialogLayout.Top)
    game.showLongText("If number of lines is zero, Button A enables additional output or if on,  turns it off.", DialogLayout.Top)
    game.showLongText("Button B  switches background color between black and white. ", DialogLayout.Top)
}
function do_same_side_output () {
    if (B_extra_output) {
        Sout = "" + N_same_side + " Same side"
        Out1.say(Sout, 500)
    }
}
function unpack_s_line (the_line: string) {
    from_split = the_line.split("|")
    P1 = parseFloat(from_split[0])
    P2 = parseFloat(from_split[1])
}
function add_a_new_line () {
    b_line_drawn = false
    while (!(b_line_drawn)) {
        P1 = Math.randomRange(0, Len_Axy_m1)
        P2 = Math.randomRange(0, Len_Axy_m1)
        Min_P1P2 = Math.min(P1, P2)
        Max_P1P2 = Math.max(P1, P2)
        s_line_points_only = "" + Min_P1P2 + "|" + Max_P1P2
        is_line_valid(Min_P1P2, Max_P1P2, s_line_points_only)
        if (b_line_is_valid) {
            get_next_random_or_cycle_color()
            pack_s_line(Min_P1P2, Max_P1P2)
            draw_line(S_line, next__color)
            saved_line_points.push(S_line)
            saved_colors.push(next__color)
            b_line_drawn = true
        }
    }
}
function make_output_sprites () {
    Out_lines = sprites.allOfKind(SpriteKind.None)
    for (let index = 0; index <= 4; index++) {
        OI = sprites.create(img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, SpriteKind.Output)
        Out_lines.push(OI)
        Out_ = Out_lines[index]
        dY = 0 - 12 * index
        Out_.y += dY
    }
    Out_lines.reverse()
    Out0 = Out_lines[0]
    Out1 = Out_lines[1]
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    up_down(1)
})
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    slider_left()
})
function make_curser () {
    SSI = image.create(W, 8)
    SS = sprites.create(SSI, SpriteKind.None)
    SS.image.fill(6)
    SS.y += 64
    CI = image.create(2, 12)
    Curser = sprites.create(CI, SpriteKind.None)
    Curser.image.fill(2)
    Curser.y += 76
    curser_base = Curser.x - 50
}
function draw_line (pts_stg: string, clr: number) {
    unpack_s_line(pts_stg)
    points_to_coordinates(P1, P2)
    SI.drawLine(A, B, X, Y, clr)
}
let CI: Image = null
let SS: Sprite = null
let SSI: Image = null
let dY = 0
let Out_: Sprite = null
let OI: Sprite = null
let Out_lines: Sprite[] = []
let s_line_points_only = ""
let Max_P1P2 = 0
let Min_P1P2 = 0
let b_line_drawn = false
let from_split: string[] = []
let Out1: Sprite = null
let Len_Axy_m1 = 0
let removed_n = 0
let removed = ""
let curser_base = 0
let Curser: Sprite = null
let Out0: Sprite = null
let Sout = ""
let Indx = 0
let b_line_is_valid = false
let Y_same = false
let X_same = false
let Cmt = ""
let line_ndx = 0
let N_same_side = 0
let N_dupes = 0
let Y = 0
let P2 = 0
let X = 0
let Ay: number[] = []
let B = 0
let P1 = 0
let Ax: number[] = []
let A = 0
let saved_colors: number[] = []
let next__color = 0
let saved_line_points: string[] = []
let S_line = ""
let Slider = 0
let redraw_ndx = 0
let Screen: Sprite = null
let SI: Image = null
let H = 0
let W = 0
let cycle_color = 0
let b_black_background = false
let b_random_colors = false
let B_extra_output = false
let constant_DO_NOT_use_saved_colors = false
let constant_use_saved_colors = false
constant_use_saved_colors = true
constant_DO_NOT_use_saved_colors = false
B_extra_output = false
b_random_colors = true
b_black_background = true
cycle_color = 0
make_background()
make_curser()
make_output_sprites()
init_perimeter_arrays()
set_slider(50)
do_from_1_to_slider_value_lines()
if (game.ask("instructions?")) {
    do_instructions()
}
