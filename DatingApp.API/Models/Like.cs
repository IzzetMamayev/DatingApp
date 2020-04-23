namespace DatingApp.API.Models
{
    public class Like
    {
        public int LikerId { get; set; }  // tot kto stavil like
        public int LikeeId { get; set; }  // like postavlenniy druqim userom ili userami
        public User Liker { get; set; }
        public User Likee { get; set; }
    }
}