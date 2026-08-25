<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('nexora:settle-tournaments')->everyMinute()->withoutOverlapping();
Schedule::command('nexora:expire-bonuses')->dailyAt('02:00');
