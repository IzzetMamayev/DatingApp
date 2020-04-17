using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{

    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }


        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }



        [HttpPost("{id}/setMain")]

        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))    //check user
            {
                return Unauthorized();
            }

            var user = await _repo.GetUser(userId);  // nashli nujnoqo usera

            if (!user.Photos.Any(p => p.Id == id))
            {
                return Unauthorized();
            }

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("This is already the main photo");
            }

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Could not set photo to main");

        }




        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var userFromRepo = await _repo.GetUser(userId);

            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();  // ImageUploadResult() vse danniye pro fotku zaqrujennuyu(cloudinary metod)

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())  // OpenReadStream() citayet danniy file
                {
                    var uploadParams = new ImageUploadParams()  // ImageUploadParams() parametri dannoy forki kotoriyu zaqruzili cropayem
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams); // viqrujayem fotku v nash cloudinary
                }
            }
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if (!userFromRepo.Photos.Any(u => u.IsMain))
            {
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);


            if (await _repo.SaveAll())
            {
                var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);

                return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoForReturn);
            }

            return BadRequest("Colud not add the photo");
        }






        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))    //check user
            {
                return Unauthorized();
            }

            var user = await _repo.GetUser(userId);  // nashli nujnoqo usera

            if (!user.Photos.Any(p => p.Id == id))
            {
                return Unauthorized();
            }

            var photoFromRepo = await _repo.GetPhoto(id); // nashli fotku imenno etoqo usera

            if (photoFromRepo.IsMain)   //proverili fotka main ili net
            {
                return BadRequest("You cant delete the main photo");
            }

            if (photoFromRepo.PublicId != null)  // foto kotoroye v cloudinary i sootvestvenno publicId etoy fotki iz cloudinary
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);  // paramteri fotki kotoruyu nujno udalit
                var result = _cloudinary.Destroy(deleteParams); // udaleniye fotki 
                
                if (result.Result == "ok")  // yesli okay udalayem i iz repo
                {
                    _repo.Delete(photoFromRepo);
                    return Ok("Photo successfully deleted");
                }

            }

            if (photoFromRepo.PublicId == null)    // foto kotoroye ne v cloudinary i sootvestvenno publicId etoy fotki iz cloudinary ne budet nayden
            {
                _repo.Delete(photoFromRepo); 
                return Ok("Photo successfully deleted");   
            }


            if (await _repo.SaveAll()) // soxranayem izmeneniya v repo
            {
                return Ok();
            }

            return BadRequest("Failed to delete the photo");

        }
    }
}
