@php
    $options = [
        '1' => 'Strongly Agree',
        '2' => 'Agree',
        '3' => 'Neither Agree nor Disagree',
        '4' => 'Disagree',
        '5' => 'Strongly Disagree'
    ];
@endphp
{{ Aire::open() }}

<p>We will now ask you some questions about how you think about time, and about numbers, in everyday life. </p>


{{ Aire::radioGroup($options, 'q1-sss')
                    ->required()
                    ->label("Some people routinely think about sequences of dates or numbers as arranged in a particular spatial configuration,as in the examples below. Do you think this might apply to you?") }}


<img src="https://www.syntoolkit.org/sites/default/files/user_images/sss.jpg" alt="" width="591" height="278" style="margin:auto;" />
<img src="https://www.syntoolkit.org/sites/default/files/user_images/sss2.jpg" alt="" width="640" height="198" style="margin:auto;" />

{{ Aire::checkboxGroup([
    'numbers' => 'Numbers',
    'days' => 'Days',
    'months' => 'Months',
    'years' => 'Years',
    'letters' => 'Letters of the alphabet',
    'temperature' => 'Temperature',
    'height' => 'Height',
    'weight' => 'Weight'], 'sss-which')
                    ->label("Which of the following do you routinely think about in this way?") }}

{{ Aire::radioGroup([
    1 => 'In the space outside my body',
    2 => 'On an imagined space that has no real location',
    3 => 'Inside my body',
    4 => 'This doesn\'t apply to me!'
], 'sss-where')
                    ->required()
                    ->label("Where do you tend to routinely experience these sequences?") }}

{{ Aire::checkboxGroup([
    'colours' => 'Colours',
    'shading' => 'Shading',
    '2d' => '2D',
    '3d' => '3D',
    'perspective' => 'Perspective',
    'blocks' => 'Like blocks or tiles',
    'font' => 'A certain font'], 'sss-char')
                    ->label("What kind of characteristics do these spatial sequences always tend to take?") }}

{{ Aire::radioGroup($options, 'num-always')
                    ->required()
                    ->label("Before doing this experiment, I always thought about NUMBERS as existing in a particular spatial sequence") }}



{{ Aire::radioGroup($options, 'days-always')
                    ->required()
                    ->label("Before doing this experiment, I always thought about DAYS OF THE WEEK as existing in a particular spatial sequence") }}


{{ Aire::radioGroup($options, 'months-always')
                    ->required()
                    ->label("Before doing this experiment, I always thought about MONTHS OF THE YEAR as existing in a particular spatial sequence") }}


{{ Aire::radioGroup($options, 'everyday-life')
                    ->required()
                    ->label("I use this way of thinking about spatial sequences in my everyday life") }}


{{ Aire::radioGroup($options, 'num-intuition')
                    ->required()
                    ->label("When doing the experiment, I didn't have any strong intuition as to where to put the NUMBERS") }}


{{ Aire::radioGroup($options, 'days-intuition')
                    ->required()
                    ->label("When doing the experiment, I didn't have any strong intuition as to where to put the DAYS OF THE WEEK") }}


{{ Aire::radioGroup($options, 'months-intuition')
                    ->required()
                    ->label("When doing the experiment, I didn't have any strong intuition as to where to put the MONTHS OF THE YEAR") }}


{{ Aire::radioGroup($options, 'no-sense')
                    ->required()
                    ->label("This experiment didn't really make much sense to me") }}

{{ Aire::textarea('anything-else','Feel free to enter any comments here. E.g. what strategy did you use? Do you want to clarify any of the above answers?') }}

{{ Aire::submit('Submit') }}

{{ Aire::close() }}
