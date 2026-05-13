using albums_api.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace albums_api.Controllers
{
    [Route("albums")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        // GET: api/album
        [HttpGet]
        public IActionResult Get()
        {
            var albums = Album.GetAll();

            return Ok(albums);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var album = Album.GetById(id);

            if (album == null)
            {
                return NotFound();
            }

            return Ok(album);
        }

        // GET: albums/search?year=2020
        [HttpGet("search")]
        public IActionResult SearchByYear([FromQuery] int year)
        {
            var albums = Album.GetByYear(year);
            return Ok(albums);
        }

        // function that retrieves albums and sorts them by title, artist or price
        [HttpGet("sort")]
        public IActionResult GetSorted(string sortBy)
        {
            var albums = Album.GetAll();
            switch (sortBy.ToLower())
            {
                case "title":
                    albums = albums.OrderBy(a => a.Title).ToList();
                    break;
                case "artist":
                    albums = albums.OrderBy(a => a.Artist.Name).ToList();
                    break;
                case "price":
                    albums = albums.OrderBy(a => a.Price).ToList();
                    break;
                default:
                    return BadRequest("Invalid sort parameter. Use 'title', 'artist' or 'price'.");
            }

            return Ok(albums);
        }

        // POST: albums
        [HttpPost]
        public IActionResult Create([FromBody] Album album)
        {
            var created = Album.Create(album);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        // PUT: albums/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Album album)
        {
            var updated = Album.Update(id, album);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        // DELETE: albums/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = Album.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
