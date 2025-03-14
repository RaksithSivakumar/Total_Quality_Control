"use client"
import { FaBell } from "react-icons/fa"

function Header({ username, onFilterClick }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQDxEQDxAVFRAREBAVEBUSEA8VFRIQGBUWFhUSExUYHSggGBsmGxMTITEhJSkrLi4uFx8zODotNygtLisBCgoKDg0OGxAQGi0iICY3LyswLy0tLS0tLTA3Kys3LS0vLTctLy0tKy0wLy0rKy0tLS0tLS0tLS0rLS0tLS0tK//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABggBBQcEAgP/xABMEAACAQICBQcFDAYIBwAAAAAAAQIDBAURBgcSITETIkFRYXGBcpGUodIIFBYyUlRigpKxwdFCQ1VzorIjJCUzRWN0oxVTs8Lh8PH/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAgMEAQUG/8QAJREBAAICAQQBBAMAAAAAAAAAAAECAxESBBMxQSEGIlGxBWGB/9oADAMBAAIRAxEAPwDuIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGq0k0gt8Pt5XF1U2YLcklnKc+iEI9LYGzqVFGLlJpRSbbbSSXS23wOYaWa6bS2bp2UPfVRPJyUnCjF9k8m5+G7tOVae6xbrFZOGbpWifMowk+cuutJfHfZwXrIaBP8S1x4rVb2KtOjF8I0qMW0vKnmzUz1kYs/8AEKvgqS+6JFQHUvttZ2L03mr+cuycKMl5nEk+Da872nkrq3pV47s3Byozy6/0ln4I5SALR6L60cOv3GCq8jWeSVOvlBt9UZ/Fl3J5k2TKTZE/0B1oXWHSjSrylXs80nCcm50l10pPq+Tw7g4s0DyYViNK6oU7ihNTpVYqUJLpT610PsPWAAAAAAAAAAAAAAAAAAAAAAAAAKv639J5X+J1YRl/V7WUqNFJ7nKLyqVMutyzXdFFitK8U96WF1c55clQqSj5eWUfW0U9zb3t5t72+tviwAADrAAAAAAAAOye570kcatbDqkuZUTq266pr+8iu9ZPwfWd1KeaJ4q7O/tbpfqq0HLyHzZr7MpFwoyTSa3prNdqDjIAAAAAAAAAAAAAAAAAAAAAAAIXrkz/AOBXuXyaHm5elmVbLZ6ybblcHv4ZZv3tUkl9KK2164oqYot7lvb3JLpb3JIDb3mjN1StqV3Ki3b1YKcZx5yjF55col8XNb83u3moLUWVqqVGnRSWzCnCGWSyaikssurcRLHtWVjcyc4RlQqS4ujlst9bpvd5sjPXPHtonDPpwMHWo6mFnvxB7OfBWqTy73Vf3EnwDVxYWslNwdapHepVmpJPrUFzfUyU56oxhtLl+iGr25v8qk/6C2f6ycXtTX+XB8V2vd3k7nqfs3HJV7hS+VtUnm+1bP3HRDJRbNaZ+F0YqxDhek+q+5tYSq28vfFKKbkoxcasV17G/aXc/AgRbE4pre0VjbVY3lCOVKvJqrFLdCtx2l1KW/xXaW4su51KrJi18w5yy3mgt66+F2NaXxp2tHa8pQSfrTKiMtZqpf8AYlh+4X80jQoSwAAAAAAAAAAAAAAAAAAAAAAAHjxekp29am2lylKpDf8ASi1+JVLV/hvvjE7SlJbo1NufYqac8n4xS8S0mN8YdW/z7jn70bhRxqnfUoqMa9GvCqlkly+SkppfSipZ+T2lN8upmq6mPcRZLAZBja2AZMAAZAGDW6SYRG9tK1tP9ZB7L+TUW+EvBpGyMiJ18uTG1V8QsatvUnSrwcKlOTUlJPiulda7VxLW6u7dUsJsKX6UbSi5LPepSipST8ZMiON6PQvMTtatVbVK0oSk4tZqdSc/6NPrS2JSy7ETfBv7x+S8/OjZXNuYhlti1Ey3QALlIAAAAAAAAAAAAAAAAAAAAA8eKUNuGa4x3+HSaFwTyzXB5rseWX4slRr77D005R3S45dDKM2LfzC/Fk18S0wMgyNTAMmAABkDABkDGys8+l5Z+H/03OEW7jFyfGXDuPmxw+OSlLe3vS6EbI1YcWvully5N/EAANCgAAAAAAAAAAAAAAAAAAAAAAABoL+32JvL4r3r8jzEhvLdVI5dK4PtI8+oxZacZbMV+UMMyYZkqWsMyYZkDB6bGhtzS6FvfceZkgsLbYh9J73+RbipylVlvxh6QAbWMAAAAAAAAAAAAAAAAAAAAAAAAAAAhc6kqVSUaiaTlJrPqbzzXWiS22LUa1StSo1YzqUJRjWUXnsSazUX2n3cW8akdmcU193an0FeTHzhZjvxlok81mjJi6wqpSzlRe1Dpi+K/M8sL+P6SafnMdqzWflrraLeHqZk8k7+PQm/Uei2w+rXyc+ZT9b7l+ZysTadQTaIjcvJWrSqPk6Sbz6un/wTSHBdyPHaWkKSyhHLrfS+9mL/ABajbKDuKsacalSNODm8k6ks8o59GeRtxY+EMmTJyl7wAWKwAAAAAAAAAAAAAAAAAAACL6R6f4fYNxr3CdVfq6S5SefU1HdHxyAlAOJ4vr1ebVnZLLonXqevYivxIdietTFa+a988lF9FGEYZfW3y9ZOKSbWXu7unSi51qkKcFxlOcYxS7W9xxnWVra2lK0wqpue6rcx6euFD2/N1nIr7EK1eW1XrVKsuupUnP72eYlFNObT/UpjnvbFFSnLKneU3TebWXLJ7VOTb6fjrt2yxhTehWlTnGpB5ThKMov6Sea+4tFoppFG4oUZyfNqwjKEs+GfGL7nu8Dtq+4V2yRWYifaTGtxbD6c4ynLmOMW3NdSW/aXSbIiesPE+Tt1Ri+fWeTy4qmsm/PuXnM+WYiszLZ0uK2XLWlfbZYDY0ZU4V4vb24qUW1w7Euh95uiEatsTzjUtpPfHn0/Je6UV3Pf4k3I4ZrNImEusw2w5rUt6/QcL1/42qlzb2UJZxoQlUqpZNcpU3QT7VFS+2dcxnFlTThB70nty6IrLf4lXNIMRd1d167efKVJOPkJ5Q/hSNVa+5YYyRa0xHpPtXOtapZbNtfuVW1WShU3yqUEuC65w7OK6M+B3fCsWoXdNVbatCrB9MJJ5dj6n2Mp0fvaXlSjLao1Z05ddOcoPzxYmm1m1ywVdwzWditvklduol0Voxqet7/WTDCNelWLSvLOE10yo1HF9+xJNPzkOEm3cgQ/RzWVh181CFfk6rySp11ybbfRFvmy8GTAhp0AAAAAAAAAAAAw3ks+oDjeujT6rRqPDbObhLYTuakW1JbXClBrhuybfajiX/r7X1mx0ixF3V5c3DefLV6k15Lk9n1ZGuL6xqHAAEnAAADrGqXE9u2qWzfOoT2o/u6jb9UtrznJyR6AYp72xCk28oVXyM+rntbLfdLZ87OxPyp6inPHMLF4RiuWVOo93CMn0dj/ADIHrAv4u8zlLdsJQWTeSTaz8eJIiAabzzu8vk0oL1yf4ozdZjjg2/Tma89VFfxEvVo5i8aV3QlCW/lFF7pb4y3NM6pi2KqK2KTzk1vkuhdnacIs6mzVpy6qkH4KSzOsMr6Kkalr+p8lq3pMe4RvWFiXvfD6zT59ZclHfvznmpP7O0zh5PtbuJbdxRtovdSg5zX058P4V/EQE2z5eL0tOOPf5AAcaAAADrmprT+rGvTw67m50qvNt5zbcqc8m1TbfGLyyXUzkZ+tpculUp1Y7pU6kJxfVKMlJfccmNw6uaDz4fdKtRpVY/FqU4TWXVKKa+89BndAAAAAAAADV6UXfI2N3V+RbVpeOw8jaEP1u13TwO9aeTcKcPCdWEGvNJnY8irkFuXcjIBoRAAAAAAym1vTya3p9T6GYAFgdGsSV1Z0K/TOC2+youbNedMhOlNTavK3Y4rzRRnVBiear2knwyq0u582ovPsP6zPHi1TauK8uutVy7tp5erIz9XP2Q3fTuHj1WSfxH7l5JcGdbhVTgpt5LYUm+pZZs5KSzSvFuRwZSTynXpU6MN+/OUec13RjIr6OfmWn6nxcq4p/uYcrxzEHc3Va4f62o2vJ4RX2VE8IBseREajQAAAAAAAC1WrC7dXBrGTebVCMH3wbhv+yiUHPdRVxt4NCP8Ayq9eHrU/+86EZ58pAAOAAAAAAHP9ec8sEqr5Va2X+4n+B0A5rr+qZYTFfKuqK820/wADtfIruADQiAAAAAAAA22ieJu1vaFb9FTUZ/u582XmzT8CS3KaqTUvjKcs+/N5/iQRk2o3HLUaNbi5U1Go+l1afNk32tbMvrGXqq7rEvZ/hckVzTWfcfoPHpviDlCztuijRc5L6U23HPuhl9o2NpR5SpGDeSk1m+qPGT8FmyH4tfe+LirXyyVSbcV1Q4Qj4RUV4EOkr5lo/nMkTwp/ryAA2vngAAAAAAAHfvc8Vs8OuYfJvZNfWpUvyOqHIvc6S/qt6uq5g/PTX5HXSi3lIABEAAAAAA5h7oJ/2ZS/1dP+SZ085b7oR/2bQ/1kP+nUJV8iv4AL0QAAAAAAAAkOi9fOFag+OSrU12x5tRL6rT+oR49WF3fIV6dXLNQlnJdcHzZrxi5IjevKswtwZZxZK3j0lN9X5K2r1M8pSiqVPyqme1l3QjU85DCSaaSVOdO2jLajCLqyafGVT4n+3GD+uyNkMNOFdSv67qIz5pvHj0AAtYwAAAAAAAHb/c5y/or9f5tF/wADOxnGPc5Pm36+nQ/lkdnKL+UgAEQAAAAADnOvPCq9zh1JW9KdWVO6hKUacJTlsbE45qKWfGSOjA7E6kVBWjd98wuvRLj2TD0cvVxsbn0Wv7Jb8E+45pT74P3nzK59Fr+yZ+D958yufRbj2S4AHcNKgfB69+Y3Xotx7I+Dl78xuvRLj2S34HcNKhx0Yv3ww+69EuPZM/BXEP2fd+iXHsluwO4aVFWimIfs679EuPZPpaI4i/8ADrr0Wv7JbgDuGlSqmiWJN5yw+6bySzdtWe5LJLh1JH5PRTEP2fd+iXHslugO5JpUP4L3/wCz7r0S49kPRi/+YXXolx7JbwDuGlQXo3ffMLr0S49k+fg9e/Mbn0W49kuAB3DSn3/Abz5lc+i1/ZM/B+8+ZXPotx7JcADuGlQFo7evhY3Xotx7Jn4NX3zC69FuPZLfAdw05RqDwavbUryVzQqUnUqUlBVac4OSjF5tKSW7nHVwCEzudugAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Hello, {username}</h1>
          <div className="flex items-center text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">1500 Points</span>
          </div>
        </div>
      </div>
      <button onClick={onFilterClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <FaBell className="text-gray-500 text-xl" />
      </button>
    </div>
  )
}

export default Header

