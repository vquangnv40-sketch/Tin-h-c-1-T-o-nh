export interface OptionItem {
  id: string;
  vi: string;
  emoji: string;
  prompt: string;
  color?: string;
}

export const ANIMALS: OptionItem[] = [
  { id: 'voi', vi: 'Con Voi', emoji: '🐘', prompt: 'cute happy baby elephant with big floppy ears' },
  { id: 'cho', vi: 'Con Chó', emoji: '🐶', prompt: 'adorable golden retriever puppy with big sparkling eyes' },
  { id: 'meo', vi: 'Con Mèo', emoji: '🐱', prompt: 'cute fluffy kitten with glowing big eyes' },
  { id: 'tho', vi: 'Con Thỏ', emoji: '🐰', prompt: 'adorable white bunny rabbit with long ears' },
  { id: 'khi', vi: 'Con Khỉ', emoji: '🐒', prompt: 'playful funny little monkey with a happy smile' },
  { id: 'sutu', vi: 'Con Sư Tử', emoji: '🦁', prompt: 'brave cute little lion cub with soft fluffy mane' },
  { id: 'ho', vi: 'Con Hổ', emoji: '🐯', prompt: 'sweet friendly tiger cub with colorful stripes' },
  { id: 'gautruc', vi: 'Gấu Trúc', emoji: '🐼', prompt: 'chubby cute panda bear holding bamboo' },
  { id: 'bo', vi: 'Con Bò', emoji: '🐮', prompt: 'cute friendly baby calf cow' },
  { id: 'lon', vi: 'Con Lợn', emoji: '🐷', prompt: 'cheerful cute pink piglet with curly tail' },
  { id: 'ngua', vi: 'Con Ngựa', emoji: '🐴', prompt: 'majestic sweet little pony horse' },
  { id: 'khunglong', vi: 'Khủng Long', emoji: '🦖', prompt: 'friendly baby green dinosaur with tiny playful spikes' },
];

export const ACTIONS: OptionItem[] = [
  { id: 'an', vi: 'Ăn trái cây', emoji: '🍎', prompt: 'happily eating sweet delicious colorful fruits' },
  { id: 'ngu', vi: 'Ngủ trên mây', emoji: '💤', prompt: 'sleeping peacefully on a soft fluffy floating glowing cloud' },
  { id: 'chay', vi: 'Chạy tung tăng', emoji: '🏃', prompt: 'running joyfully across field with flower petals floating' },
  { id: 'nhay', vi: 'Nhảy bắt bướm', emoji: '🦋', prompt: 'jumping happily chasing glowing magical butterflies' },
  { id: 'boi', vi: 'Bơi lội', emoji: '🏊', prompt: 'swimming happily in sparkling clear turquoise water' },
  { id: 'bay', vi: 'Bay lượn', emoji: '🕊️', prompt: 'flying high gracefully with magical floating stars' },
  { id: 'hat', vi: 'Hát ca', emoji: '🎤', prompt: 'singing happily with rainbow musical notes floating in the air' },
  { id: 'mua', vi: 'Múa ba lê', emoji: '💃', prompt: 'dancing happily in cute costume with sparkly trails' },
  { id: 'docsach', vi: 'Đọc sách', emoji: '📖', prompt: 'reading a magic glowing fairytale storybook' },
  { id: 'choibong', vi: 'Chơi bóng', emoji: '⚽', prompt: 'playing happily with a colorful giant bouncing ball' },
  { id: 'bongbong', vi: 'Thổi bong bóng', emoji: '🎈', prompt: 'blowing giant rainbow soap bubbles into the sky' },
  { id: 'dandan', vi: 'Đánh đàn', emoji: '🎸', prompt: 'playing a small cheerful musical instrument' },
];

export const BACKGROUNDS: OptionItem[] = [
  { id: 'rung', vi: 'Trong rừng', emoji: '🌲', prompt: 'in an enchanted magical fairytale forest with glowing mushrooms and soft sunlight' },
  { id: 'baibien', vi: 'Trên bãi biển', emoji: '🏖️', prompt: 'on a tropical sunny beach with golden sand, palm trees and rainbow ocean' },
  { id: 'daiduong', vi: 'Dưới đại dương', emoji: '🌊', prompt: 'underwater in a colorful coral reef with glowing bubbles and friendly sea creatures' },
  { id: 'congvien', vi: 'Trên công viên', emoji: '🎡', prompt: 'in a joyful fairytale amusement park with ferris wheel and colorful balloons' },
  { id: 'nha', vi: 'Trong ngôi nhà', emoji: '🏡', prompt: 'in a cozy colorful fairytale mushroom house surrounded by flowers' },
  { id: 'vutru', vi: 'Trên vũ trụ', emoji: '🚀', prompt: 'in deep magical space with colorful glowing nebulae, planets, shooting stars' },
  { id: 'laudai', vi: 'Trong lâu đài', emoji: '🏰', prompt: 'in front of a grand fairytale castle with rainbow towers' },
  { id: 'dongco', vi: 'Trên đồng cỏ', emoji: '🌾', prompt: 'in a sunny green meadow filled with blooming colorful wildflowers' },
  { id: 'keongot', vi: 'Xứ sở kẹo ngọt', emoji: '🍬', prompt: 'in a fantasy candy kingdom with lollipop trees and donut hills' },
];

export const STYLES: OptionItem[] = [
  { id: '3d_chibi', vi: 'Hoạt hình 3D Chibi', emoji: '🧸', prompt: '3D Pixar style animation render, soft studio lighting, cute chibi character, vibrant 8k' },
  { id: '2d', vi: 'Hoạt hình 2D', emoji: '🎨', prompt: 'vibrant 2D cartoon animation artwork, clean soft lines, colorful storybook style' },
  { id: 'maunuoc', vi: 'Màu nước', emoji: '🖌️', prompt: 'dreamy fairytale watercolor painting, soft splashes, magical lighting' },
  { id: 'sondau', vi: 'Tranh sơn dầu', emoji: '🖼️', prompt: 'rich artistic oil painting texture, bright cheerful impressionist style' },
  { id: 'phim', vi: 'Phim hoạt hình', emoji: '🎬', prompt: 'cinematic animation movie shot, dynamic lighting, beautiful masterpiece' },
  { id: 'datset', vi: 'Phong cách đất sét', emoji: '🧱', prompt: 'cute claymation 3D plasticine model style, smooth clay art texture' },
];

export const STICKERS = ['⭐', '👑', '🪄', '❤️', '🌈', '🎈', '🌸', '🍦', '🚀', '🍭', '🐾', '✨'];
