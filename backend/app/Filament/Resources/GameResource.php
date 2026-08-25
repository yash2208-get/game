<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GameResource\Pages;
use App\Models\Game;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class GameResource extends Resource
{
    protected static ?string $model = Game::class;
    protected static ?string $navigationIcon = 'heroicon-o-puzzle-piece';
    protected static ?string $navigationGroup = 'Game operations';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')->required()->maxLength(120),
            TextInput::make('slug')->required()->unique(ignoreRecord: true),
            TextInput::make('category')->required()->maxLength(30),
            Textarea::make('description')->columnSpanFull(),
            TextInput::make('icon')->maxLength(20),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->searchable()->sortable(),
            TextColumn::make('category')->badge(),
            TextColumn::make('rooms_count')->counts('rooms')->label('Active rooms'),
            IconColumn::make('is_active')->boolean(),
            TextColumn::make('updated_at')->dateTime()->sortable(),
        ])->actions([EditAction::make()])->defaultSort('updated_at', 'desc');
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListGames::route('/'), 'create' => Pages\CreateGame::route('/create'), 'edit' => Pages\EditGame::route('/{record}/edit')];
    }
}
