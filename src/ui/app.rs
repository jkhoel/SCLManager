use iced::widget::{column, text};

use iced::Application;
use iced::{alignment, window};
use iced::{Color, Command, Length, Settings};

pub fn app() -> iced::Result {
    App::run(Settings {
        antialiasing: true,
        window: window::Settings {
            size: (500, 800),
            ..window::Settings::default()
        },
        ..Settings::default()
    })
}

#[derive(Debug)]
struct App;

impl Application for App {
    type Executor = iced::executor::Default;

    type Message = ();

    type Theme = iced::Theme;

    type Flags = ();

    fn new(_flags: Self::Flags) -> (Self, Command<Self::Message>) {
        (App, Command::none()) // Should do loading of settings, previous session and cache data here
    }

    fn view(&self) -> iced::Element<'_, Self::Message, iced::Renderer<Self::Theme>> {
        // should match on App:Loading or Loaded here, but will skip for now

        let title = text("Hello world!")
            .width(Length::Fill)
            .size(100)
            .style(Color::from([0.5, 0.5, 0.5]))
            .horizontal_alignment(alignment::Horizontal::Center);

        let content = column![title].width(Length::Fill).padding(40);

        content.into()
    }

    fn title(&self) -> String {
        "SCL Manager".into()
    }

    fn update(&mut self, _message: Self::Message) -> Command<Self::Message> {
        Command::none()
    }
}
